document.addEventListener('DOMContentLoaded', function() {

    $("#addExerciseButton").click(function() {
        event.preventDefault();
        var date = $("input[name='Date']").val();
        if(date==='') {
            $("input[name='Date']").focus();
            return;
        }
        var name = $("input[name='Exercise']").val();
        if(name==='') {
            $("input[name='Exercise']").focus();
            return;
        }
        var weight = $("input[name='Weight']").val();
        if(weight==='') {
            $("input[name='Weight']").focus();
            return;
        }
        var lbs = $("input[name='Lbs']:checked").val();
        if(lbs==='') {
            $("input[name='Lbs']").focus();
            return;
        }
        var reps = $("input[name='Reps']").val();
        if(reps==='') {
            $("input[name='Reps']").focus();
            return;
        }

        var req = new XMLHttpRequest();
        var content = {
            date: date,
            name: name,
            weight: weight,
            lbs: lbs,
            reps: reps
        };
        if(lbs==1) {lbs="lbs"}
        else {lbs="kgs"}
        req.open('POST','/addExercise',true);
        req.setRequestHeader('Content-Type','application/JSON');
        req.addEventListener('load',function() {
            var response = JSON.parse(req.responseText);
            if(response.status>=200 && response.status<400) {
                var tableRow = "<tr><td>"+date+"</td><td>"+name+"</td><td>"+
                    weight+"</td><td>"+lbs+"</td><td>"+reps+"</td>"+
                    "<td><form action=''><button type='submit' class='btn btn-default editButton' id='"+ response.response.insertId +"'>Edit</button></form></td>"+
                    "<td><form action=''><button type='submit' class='btn btn-default deleteButton' id='"+ response.response.insertId +"'>Delete</button></form></td>"+
                    "</tr>";
                $("table tbody").append(tableRow);

                $(":input:text, :input[type='number']").val('');
                $("input[name='Exercise']").focus();
            }
            else {
                console.log("Server Error: " + response.status);
            }
        });
        req.send(JSON.stringify(content));
        $(".editButton, .deleteButton,#addExerciseButton").prop("disabled",false);
    });

    $("table").on("click",".deleteButton", function() {
        event.preventDefault();
        var content = { deleteId: this.id };
        console.log("Deleting item at id: " + this.id);

        var req = new XMLHttpRequest();
        req.open('DELETE','/deleteExercise',true);
        req.setRequestHeader('Content-Type','application/JSON');
        req.addEventListener('load',function() {
            var response = JSON.parse(req.responseText);
            if(response.status>=200 && response.status<400) {
                console.log("Item successfully deleted.");
            }
            else {
                console.log("Server Error: " + response.status);
            }
        });
        $(this).closest('tr').remove();
        req.send(JSON.stringify(content));
        $(".editButton, #addExerciseButton").prop("disabled",false);
    });

    $("table").on("click",".editButton", function() {
        event.preventDefault();
        $(".editButton, #addExerciseButton").prop("disabled",true);
        var rowId = this.id;

        function editTransform(row) {
            row[0].innerHTML = ' <input type="date" required name="saveDate" form="addExercise" value="' + row[0].innerText + '"/> ';
            row[1].innerHTML = ' <input type="text" required name="saveExercise" placeholder="Exercise" form="addExercise" value="' + row[1].innerText + '"/> ';
            row[2].innerHTML = ' <input type="number" name="saveWeight" placeholder="Weight" form="addExercise" value="' + row[2].innerText + '"/> ';
            row[3].innerHTML = ' <label>lbs<input type="radio" required checked name="saveLbs" value=1 form="addExercise"></label>\n' +
                                ' <label>kgs<input type="radio" required name="saveLbs" value=0 form="addExercise"></label> ';
            row[4].innerHTML = ' <input type="number" name="saveReps" placeholder="Reps" form="addExercise" value="' + row[4].innerText + '"/> ';

            row[5].innerHTML = ' <td><form action=""><button type="submit" class="btn btn-default saveButton" id="' + this.id + '">Save</button></form></td> ';
        }
        editTransform($(this).closest('tr').children('td'));
        $(".saveButton").click(function() {
           event.preventDefault();

            var date = $("input[name='saveDate']").val();
            var name = $("input[name='saveExercise']").val();
            if(name==='') {
                $("input[name='saveExercise']").focus();
                return;
            }
            var weight = $("input[name='saveWeight']").val();
            var lbs = $("input[name='saveLbs']:checked").val();
            var reps = $("input[name='saveReps']").val();
            var content = {
                date: date,
                name: name,
                weight: weight,
                lbs: lbs,
                reps: reps,
                updateId: rowId
            };
            if(lbs==1) {lbs="lbs"}
            else {lbs="kgs"}


            var req = new XMLHttpRequest();
            req.open('PATCH', '/patchExercise',true);
            req.setRequestHeader('Content-Type','application/JSON');
            req.addEventListener('load',function() {
                var response = JSON.parse(req.responseText);
                if(response.status>=200 && response.status<400) {
                    //reset the row.
                    $('#'+rowId).closest('tr')[0].outerHTML = "<tr><td>"+date+"</td><td>"+name+"</td><td>"+
                        weight+"</td><td>"+lbs+"</td><td>"+reps+"</td>"+
                        "<td><form action=''><button type='submit' class='btn btn-default editButton' id='"+ rowId +"'>Edit</button></form></td>"+
                        "<td><form action=''><button type='submit' class='btn btn-default deleteButton' id='"+ rowId +"'>Delete</button></form></td>"+
                        "</tr>";
                }
                else {
                    console.log("Server Error: " + response.status);
                }
            });
            req.send(JSON.stringify(content));
            $(".editButton, #addExerciseButton").prop("disabled",false);
        });

    });


});