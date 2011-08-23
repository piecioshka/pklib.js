pklib - darmowa biblioteka JavaScript
=====================================

Opis
-----

**pklib** jest wynikiem ciągłego używania z tych samych wzorców w sieci web, 
z dodatkiem ogromu przydatnych metod używanych na co dzień w naszych projektach. 
Źródła biblioteki są w całości na Git'cie, korzystając z usługi [GitHub.com](http://www.github.com "GitHub").<br />
Biblioteka jest rozwijana z podziałem na moduły, np. moduł **pklib.profiler** ma swoje źródła w plikub profiler.js w katalogu "src"

Wersje
-----------------

Wersję release'ów bibilioteki są iterowane w następujący sposób:

* Pierwsza cyfra jest zmieniana gdy cała architektura biblioteki nabiera innego kształtu,
* Druga cyfra jest aktualizowane gdy następuje ogromna porcja nowych obiektów bądź metod w dowolnym namespace'sie
* Trzecia cyferka jest bardzo często inkrementowana, z uwagi na proces dewelopmentu całej biblioteki

Do *core* biblioteki zostały napisane unit testy w [QUnit](http://docs.jquery.com/Qunit "QUnit")

Budowa biblioteki
-----------------

Każda wersja posiada własny tag w gałęzi projektu. Dla poprawy pracy nad biblioteką został napisany skrypt w bashu,
który ma za zadanie generować kod całej biblioteki z aktualnego katalogu w jeden duży plik. 
Każdy tag ma w swoich żródłach juz wygenerowany plik z kodem źródłowym biblioteki, ale gdy istniała potrzeba 
wygenerowanie biblioteki z aktualnych źródeł dostępnych w branch'ach plik **Makefile**, bo o nim mowa,
znajduje swoje praktyczne zastosowanie.

`piecioshka:~/library/pklib$ ./Makefile`


Opis modułów prezentacyjnych
----------------------------

* **pklib.loader** - obsługa loadera, który jest dodawanym do drzewa DOM elementem o określonych parametrach.
Wymiary obrazka jak i link do obrazka jest łatwo konfigurowalny.
Gdy tylko pokażemy loader za pomocą metody **pklib.loader.show** zostanie on z default'u wycentrowany.
Kontener w którym chcemy umieścić (pre)loader jest łatwy do zmiany, gdyż nie zawsze chcemy aby 
loader znajdował się na środku całej strony, ale być może tylko w danym kontenerze na stronie.  
* **pklib.message** - top layer, który jest ponad wszystkimi elementami w drzewie DOM.
Pomocny gdy chcemy wyświetlić informację, wiadomość bądź komunikat użytkownikowi.
Dzięki dobremu algorytmowi, warstwa której jasno zdefiniujemy wymiary zawsze pozostanie na środku strony.
Obłsuga layera posiada "zamykanie", a tak na prawdę usuwanie z drzewa DOM elementu będącego top layerem, 
layera, tj. usunięcie z widoku warstwy reprezentującej komunikat dla użytkownika.
* **pklib.glass** - wartwa przysłaniająca cały content strony. 
Dzięki przroczystości otrzymamy efekt dezaktywacji strony. 
Layer służy do wyłączenia częśći bądź całęj strony aby przykładowo wyświetlić komunikat.

Szczegóły
---------

Autor: **Piotr Kowalski** ( [http://piecioshka.pl/](http://piecioshka.pl/ "homepage") ) <br />
Licencja: **GPL 3.0 License** ( [http://pklib.com/license](http://pklib.com/license "pklib license") ) 


Przykładowy kod
---------------

```js
pklib.file.load("pklib.message.js", function(file){
    pklib.message.show();
});
```

