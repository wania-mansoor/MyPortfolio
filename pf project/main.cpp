// =====================================================================
//  MYSTERY GAME - Who Stole the Championship Trophy?
//  Programming Fundamentals (CS111L) Project - one file, full outline.
// =====================================================================
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <cctype>
#include <iomanip>
using namespace std;

const int MAX_SCORES = 100;   // global constant

// Difficulty levels: the value is the number of attempts allowed
enum Difficulty { EASY = 3, NORMAL = 2, HARD = 1 };

// A union can hold only ONE of its members at a time (the chosen reward)
union Reward {
    int bonusPts;
    int extraTry;
};

// Nested structure: Stats is used inside Player
struct Stats {
    int played = 0;
    int won = 0;
};

struct Player {
    string name;
    int score = 0;
    Stats stats;
};

struct Suspect {
    string name;
    string role;
};

// --------------------- Function prototypes ---------------------
void banner(string title = "MYSTERY GAME");        // default argument
void display();                                    // overloaded functions
void display(string msg);
int  loadClues(vector<string> &clues);             // reference parameter
void showClues(const vector<string> &clues);
void showEvidence(Suspect *s, int ev[][3], int n); // pointer + 2D array
int  findSuspect(Suspect *s, int n, string name);  // linear search
bool checkAnswer(Suspect *guess, Suspect *culprit);// pointer comparison
inline int calcScore(int used, Difficulty d);      // inline function
void saveScore(int score);                         // pass by value
int  loadScores(int a[]);
void bubbleSort(int a[], int n);
int  rankOf(int a[], int n, int key);              // binary search
int  sumScores(int a[], int n);                    // recursive function
void pause();                                      // waits for Enter key
bool onlyLetters(string s);                        // checks alphabets-only text
void fixCase(string &s);                           // "megan" becomes "Megan"

int main() {
    banner();

    Player p;
    cout << "Enter detective name: ";
    getline(cin, p.name);

    // Name validation: not empty, maximum 25 characters, alphabets only
    while (p.name.empty() || p.name.length() > 25 || !onlyLetters(p.name)) {
        if (p.name.length() > 25)
            cout << "Name is too long! Maximum 25 characters allowed.\n";
        else if (!onlyLetters(p.name))
            cout << "Name can contain alphabets only! No numbers or symbols.\n";
        else
            cout << "Name cannot be empty!\n";
        cout << "Enter detective name: ";
        getline(cin, p.name);
    }

    // ----- Difficulty selection -----
    Difficulty d = NORMAL;
    string key;
    cout << "Choose difficulty - (E)asy, (N)ormal, (H)ard: ";
    cin >> key;

    // Difficulty validation: only E, N or H is accepted, nothing else
    while (key != "E" && key != "e" && key != "N" && key != "n" && key != "H" && key != "h") {
        cout << "Invalid key! Press E, N or H: ";
        cin >> key;
    }

    char ch = toupper(key[0]);        // character handling
    switch (ch) {
        case 'E':
            d = EASY;
            break;
        case 'H':
            d = HARD;
            break;
        default:
            d = NORMAL;
    }

    // ----- Suspects created with dynamic memory -----
    Suspect *suspects = new Suspect[4];
    suspects[0] = {"Alex", "Captain"};
    suspects[1] = {"Ryan", "Goalkeeper"};
    suspects[2] = {"Megan", "Coach"};
    suspects[3] = {"Noah", "Player"};
    Suspect *culprit = suspects + 2;  // pointer arithmetic (Megan)

    // Evidence board (2D array): Has Key / Seen Near / Has Alibi
    int evidence[4][3] = {
        {1, 0, 1}, {0, 1, 1},
        {1, 1, 0}, {1, 0, 1}
    };

    vector<string> clues;
    int clueCount = loadClues(clues);
    vector<int> guesses;              // history of all guesses
    bool solved = false;
    int choice;

    // ----- Main menu loop (sentinel value 5 = Exit) -----
    do {
        display();
        cout << "1. Read Clues\n";
        cout << "2. Evidence Board\n";
        cout << "3. Solve Mystery\n";
        cout << "4. Leaderboard\n";
        cout << "5. Exit\n";
        cout << "Choice: ";
        cin >> choice;

        while (cin.fail() || choice < 1 || choice > 5) {   // input validation loop
            cin.clear();                                   // clear the error state
            cin.ignore(1000, '\n');                        // throw away the wrong input
            cout << "Invalid choice, enter 1-5: ";
            cin >> choice;
        }

        switch (choice) {
            case 1:
                showClues(clues);
                break;
            case 2:
                showEvidence(suspects, evidence, 4);
                break;
            case 3: {
                if (solved) {
                    display("Case already solved!");
                    break;
                }
                static int caseNo = 0;     // static variable
                caseNo++;
                cout << "--- Case #" << caseNo << " : attempts allowed = " << (int)d << " ---\n";
                p.stats.played++;

                int used = 0;
                bool won = false;
                cin.ignore();
                while (used < (int)d && !won) {   // attempts loop
                    cout << "Who stole the trophy? Enter suspect name: ";
                    string ans;
                    getline(cin, ans);

                    if (ans.empty()) {   // empty input does not waste an attempt
                        cout << "Please type a suspect name.\n";
                        continue;
                    }
                    fixCase(ans);        // "megan" or "MEGAN" becomes "Megan"

                    int idx = findSuspect(suspects, 4, ans);
                    guesses.push_back(idx);
                    used++;

                    if (idx == -1)
                        cout << "No such suspect! Suspects are Alex, Ryan, Megan, Noah.\n";
                    else if (checkAnswer(suspects + idx, culprit))
                        won = true;
                    else if (used < (int)d)
                        cout << "Wrong! " << (int)d - used << " attempt(s) left.\n";
                }

                if (won) {
                    solved = true;
                    p.stats.won++;
                    p.score = calcScore(used, d);

                    Reward r;            // union in action
                    string tag;
                    cout << "Correct! It was " << culprit->role << " " << culprit->name << ".\n";
                    cout << "Pick reward - 1) +50 bonus points   2) +1 extra try next case: ";
                    cin >> tag;

                    // Reward validation: only 1 or 2 is accepted
                    while (tag != "1" && tag != "2") {
                        cout << "Invalid key! Press 1 or 2: ";
                        cin >> tag;
                    }

                    if (tag == "1") {
                        r.bonusPts = 50;
                        p.score += r.bonusPts;
                    } else {
                        r.extraTry = 1;
                        cout << "Extra try saved for next case: " << r.extraTry << endl;
                    }

                    if (p.score >= 300)
                        display("Rank: MASTER DETECTIVE");
                    else if (p.score >= 150)
                        display("Rank: SHARP DETECTIVE");
                    else
                        display("Rank: JUNIOR DETECTIVE");

                    saveScore(p.score);
                    display("Score saved to scores.txt");
                } else {
                    cout << "Out of attempts! The thief was " << culprit->name << ".\n";
                }
                break;
            }
            case 4: {
                int scores[MAX_SCORES];
                int n = loadScores(scores);
                if (n == 0) {
                    display("No scores yet - solve the case first!");
                    break;
                }
                bubbleSort(scores, n);
                cout << "--- Top Scores ---\n";
                for (int i = 0; i < n && i < 5; i++)
                    cout << i + 1 << ". " << scores[i] << endl;
                cout << "Total of all scores: " << sumScores(scores, n) << endl;
                if (p.score > 0)
                    cout << "Your score " << p.score << " is at rank " << rankOf(scores, n, p.score) << endl;
                break;
            }
        }

        // After options 1, 2 and 4, wait so the player can read the output
        if (choice == 1 || choice == 2 || choice == 4)
            pause();

    } while (choice != 5);

    // ----- Session summary -----
    if (p.stats.played > 0) {
        double winRate = (double)p.stats.won / p.stats.played * 100;   // type casting
        cout << "Cases played: " << p.stats.played << " | Win rate: " << winRate << "%\n";
    }
    cout << "Clues loaded: " << clueCount << " | Total guesses made: " << guesses.size() << endl;

    delete[] suspects;                     // free dynamic memory
    display("Thanks for playing, Detective " + p.name + "!");
    return 0;
}

// --------------------- Function definitions ---------------------

void banner(string title) {
    display();
    cout << "            " << title << "\n";
    cout << "    Who Stole the Championship Trophy?\n";
    display();
}

void display() {
    cout << "==================================================\n";
}

void display(string msg) {
    cout << msg << endl;
}

void pause() {
    cout << "\nPress Enter to continue...";
    cin.ignore();
    cin.get();
}

bool onlyLetters(string s) {
    bool found = false;   // the name must contain at least one alphabet
    for (int i = 0; i < (int)s.length(); i++) {
        if (isalpha(s[i]))
            found = true;
        else if (s[i] != ' ')
            return false;   // digits and symbols are not allowed
    }
    return found;
}

void fixCase(string &s) {   // first letter capital, all other letters small
    for (int i = 0; i < (int)s.length(); i++) {
        if (i == 0)
            s[i] = toupper(s[i]);
        else
            s[i] = tolower(s[i]);
    }
}

int loadClues(vector<string> &clues) {       // file handling: reading
    ifstream in("clues.txt");
    if (!in) {
        cout << "Error: clues.txt not found!\n";
        return 0;
    }
    string line;
    while (getline(in, line)) {              // read line by line
        if (!line.empty())
            clues.push_back(line);
    }
    in.close();
    return (int)clues.size();
}

void showClues(const vector<string> &clues) {
    if (clues.empty()) {
        display("No clues available.");
        return;
    }
    cout << "--- Clues ---\n";
    int i = 1;
    for (string c : clues)                   // range-based for loop
        cout << "Clue " << i++ << ": " << c << endl;
}

void showEvidence(Suspect *s, int ev[][3], int n) {
    cout << "--- Evidence Board (1 = Yes, 0 = No) ---\n";
    cout << left << setw(18) << "Suspect" << setw(9) << "Has Key" << setw(11) << "Seen Near" << "Has Alibi\n";
    for (int i = 0; i < n; i++) {            // nested loops
        cout << left << setw(18) << ((s + i)->role + " " + (s + i)->name);
        for (int j = 0; j < 3; j++)
            cout << setw(9) << ev[i][j];
        cout << endl;
    }
    display("Hint: the thief HAS the key, WAS seen nearby and has NO alibi.");
}

int findSuspect(Suspect *s, int n, string name) {   // linear search
    for (int i = 0; i < n; i++) {
        if ((s + i)->name == name)
            return i;
    }
    return -1;
}

bool checkAnswer(Suspect *guess, Suspect *culprit) {
    return guess == culprit;               // comparing pointers
}

inline int calcScore(int used, Difficulty d) {
    // fewer attempts = more points, multiplied by difficulty
    return (100 - (used - 1) * 25) * (4 - (int)d);
}

void saveScore(int score) {                  // file handling: appending
    ofstream out("scores.txt", ios::app);
    out << score << endl;
    out.close();
}

int loadScores(int a[]) {
    ifstream in("scores.txt");
    int n = 0, x;
    while (in >> x && n < MAX_SCORES)
        a[n++] = x;
    in.close();
    return n;
}

void bubbleSort(int a[], int n) {            // descending order
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (a[j] < a[j + 1]) {
                int t = a[j];
                a[j] = a[j + 1];
                a[j + 1] = t;
            }
        }
    }
}

int rankOf(int a[], int n, int key) {        // binary search (descending array)
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (a[mid] == key)
            return mid + 1;
        else if (a[mid] > key)
            lo = mid + 1;
        else
            hi = mid - 1;
    }
    return -1;
}

int sumScores(int a[], int n) {              // recursion
    if (n == 0)
        return 0;
    return a[n - 1] + sumScores(a, n - 1);
}
