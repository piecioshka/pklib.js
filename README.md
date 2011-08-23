pklib - darmowa biblioteka JavaScript
=====================================

### Opis
**pklib** jest wynikiem ciągłego używania z tych samych wzorców w sieci web, 
z dodatkiem ogromu przydatnych metod używanych na co dzień w naszych projektach. <br />

Do core biblioteki zostały napisane unit testy w <a href="http://docs.jquery.com/Qunit">QUnit</a>

<br /><br />
<ul>
    <li>
        **pklib.loader** - obsługa loadera, który jest dodawanym do drzewa DOM elementem o określonych parametrach.
        Wymiary obrazka jak i link do obrazka jest łatwo konfigurowalny.
        Gdy tylko pokażemy loader za pomocą metody **pklib.loader.show** zostanie on z default'u wycentrowany.
        Kontener w którym chcemy umieścić (pre)loader jest łatwy do zmiany, gdyż nie zawsze chcemy aby 
        loader znajdował się na środku całej strony, ale być może tylko w danym kontenerze na stronie.  
    </li>
    <li>
        **pklib.message** - top layer, który jest ponad wszystkimi elementami w drzewie DOM.
        Pomocny gdy chcemy wyświetlić informację, wiadomość bądź komunikat użytkownikowi.
        Dzięki dobremu algorytmowi, warstwa której jasno zdefiniujemy wymiary zawsze pozostanie na środku strony.
        Obłsuga layera posiada "zamykanie", a tak na prawdę usuwanie z drzewa DOM elementu będącego top layerem, 
        layera, tj. usunięcie z widoku warstwy reprezentującej komunikat dla użytkownika.
    </li>
    <li>
        **pklib.glass** - wartwa przysłaniająca cały content strony. 
        Dzięki przroczystości otrzymamy efekt dezaktywacji strony. 
        Layer służy do wyłączenia częśći bądź całęj strony aby przykładowo wyświetlić komunikat.
    </li>
</ul>
 
Autor: **Piotr Kowalski**<br />
Licencja: **GPL 3.0 License** ( <a href="http://pklib.com/license">http://pklib.com/license</a> ) 

```js
pklib.file.load("pklib.message.js", function(){
    pklib.message.show();
});
```

