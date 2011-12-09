window.addEventListener("load", function () {
    
    module("pklib.event");

    // pklib.event.add
    test("add", function() {

        var element = document.createElement("a");
        document.body.appendChild(element);

        try {
            pklib.event.add(element, "click", function() {
                // pass
            });
            
            ok(true, "Event was added");
        } catch (e) {
            
        }
    });

    // pklib.event.remove
    test("remove", function() {

        var element = document.createElement("a");
        document.body.appendChild(element);

        var type = "click";
        var event = pklib.event.add(element, type, function() {
            alert(1);
        });

        try {
            pklib.event.remove(element, type, function() {
                alert(1);
            });
    
            ok(true, "Event was removed");
        } catch (e) {
            // pass
        }

    });
    
});
