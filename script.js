$(document).ready(function() {
    var currentPhase = 1;
    var totalPhases = 5;
    var formValues = {};

    $("#btn-next").click(function() {
        if(validateForm()){
            if (currentPhase < totalPhases) {
                saveFormValues();
                currentPhase++;
                showPhase(currentPhase);
            }
            if(currentPhase === totalPhases){
                // Change the button text to "Submit"
                $(this).text("Submit");
            }
        } else {
            //Add the error message back
            if ($("#error-message").length === 0){
                $("<span id= 'error-message' class='error-message'>*All input fields should be filled in!</span>").insertBefore("#btn-prev");            }
        }
    });

    $("#btn-prev").click(function() {
        if (currentPhase > 1) {
        saveFormValues();
        currentPhase--;
        showPhase(currentPhase);

        $("#error-message").remove();
        }
        if(currentPhase < totalPhases){
            // Change the button text back to "Next"
            $("#btn-next").text("Next");
        }
    });

    function saveFormValues() {
        var phaseInputs = $("#phase-" + currentPhase + " input, #phase-" + currentPhase + " select");

        phaseInputs.each(function(){
            var inputName = $(this).attr("name");
            var inputValue = $(this).val();
            formValues[inputName] = inputValue;
        });
    }

    function showPhase(phaseNumber) {
        $(".phase").addClass("hidden");
        $("#phase-" + phaseNumber).removeClass("hidden");

        //Enable/disable the previous button based on the phase number
        if(phaseNumber === 1){
            $("#btn-prev").prop("disabled", true);
        } else {
            $("#btn-prev").prop("disabled", false);
        }

        // Populate the Inputs with the saved values
        var phaseInputs = $("#phase-" + phaseNumber + " input, #phase-" + phaseNumber + " select");

        phaseInputs.each(function(){
            var inputName = $(this).attr("name");
            var savedValue = formValues[inputName];

            if ($(this).attr("type") === "file") {
                $(this).val(""); // Clear the file input field
                $(this).off("change"); // Remove previous change event listener
        
                // Add new change event listener to handle file selection
                $(this).on("change", function() {
                    handleFileSelect(this, inputName);
                });
            } else {
                if (savedValue) {
                    $(this).val(savedValue);
                }
            }
        });
     }

     function validateForm() {
        var currentPhaseFields = $("#phase-" + currentPhase).find("input, select");
        var isValid = true;

        currentPhaseFields.each(function() {
            if ($(this).val() === "") {
                isValid = false;
                return false; // Exit the loop if any field is empty
            }
        });

        if (!isValid) {
            $("#error-message").text("*All input fields should be filled in!");
            $("#error-message").show();
            return false; // Prevent form submission
        }

        // Hide the error message if all fields are filled in
        $("#error-message").hide();

        return true; // Allow form submission
    }
   

    function handleFileSelect(input, inputName) {
        var file = input.files[0];
        var reader = new FileReader();

        reader.onloadend = function() {
            var base64data = reader.result;
            formValues[inputName] = base64data; //Save the base 64 string
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }
});
