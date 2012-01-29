# pklib - darmowa biblioteka JavaScript

**pklib** jest wynikiem ciągłego używania z tych samych wzorców w sieci web,<br />
z dodatkiem ogromu przydatnych metod używanych na co dzień w naszych projektach.<br /> 
Źródła biblioteki znajdują się na (http://www.github.com/ "github.com).<br /><br />

Biblioteka jest rozwijana z podziałem na moduły.

Przykład:
    moduł `pklib.profiler`<br />
    kod: `src/profiler.js`

## wersje

Wersję release'ów bibilioteki są iterowane w następujący sposób:

* Pierwsza cyfra jest zmieniana gdy cała architektura biblioteki nabiera innego kształtu,
* Druga cyfra jest aktualizowane gdy następuje ogromna porcja nowych obiektów bądź metod w dowolnym namespace'sie
* Trzecia cyferka jest bardzo często inkrementowana, z uwagi na proces dewelopmentu całej biblioteki

Biblioteki posiada unit testy w napisane zgodnie ze specyfikację (http://docs.jquery.com/Qunit "QUnit")

## budowa biblioteki

Każda wersja posiada własny tag w gałęzi projektu. Dla poprawy pracy nad biblioteką został napisany skrypt w bashu,
który ma za zadanie generować kod całej biblioteki z aktualnego katalogu w jeden duży plik. 
Każdy tag ma w swoich żródłach juz wygenerowany plik z kodem źródłowym biblioteki, ale gdy istniała potrzeba 
wygenerowanie biblioteki z aktualnych źródeł dostępnych w branch'ach plik **Makefile**, bo o nim mowa,
znajduje swoje praktyczne zastosowanie.

`piecioshka:~/lib/pklib$ ./Makefile`

## dokumentacja

(http://api.pklib.com "Dokumentacja")

## szczegóły

autor: **Piotr Kowalski** ( [http://piecioshka.pl/](http://piecioshka.pl/ "homepage") ) <br />
licencja: **MIT License** ( [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php "license") ) 
