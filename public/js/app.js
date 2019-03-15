$(document).ready(function()
{
    var articleID;
    $("#scrapeAtricleButton").on("click", function(event)
    {
        event.preventDefault();
        $.get("/scrape", function(data)
        {
            $(".articles").empty();
            // article cards
            data.forEach(element => {
            var card = $("<div>").addClass("card").attr("id", element._id);
            var cardHeader = $("<div>").addClass("card-header");
            var headerLink = $("<a>").attr("href", element.link).text(element.title);
            var savebutton = $("<button>").addClass("btn btn-success cardHeaderButton savebutton").attr({"href": "#", "id" : element._id}).text("Save Article");
            var cardBody = $("<div>").addClass("card-body");
            var cardParagraph  = $("<p>").addClass("card-text").text("No Summary for the Article found");
            $(cardHeader).append(headerLink).append(savebutton);
            $(card).append(cardHeader);
            $(cardBody).append(cardParagraph);
            $(card).append(cardBody);
            $(".articles").append(card).append("<br>"); 
        });

        });
    });

    $("#clearArticleButtonIndex").on("click", function(event)
    {
        
        event.preventDefault();
        $(".articles").empty();

        // top card
        var emptycard = $("<div>").addClass("card");
        var emptycardheader = $("<div>").addClass("card-header noArticlesCard").text("Oh no there are no articles");
        $(emptycard).append(emptycardheader);
        $(".articles").append(emptycard); 
        $(".articles").append("<br>"); 

        // bottom card
        var emptycard2 = $("<div>").addClass("card");
        var emptycardheader2 = $("<div>").addClass("card-header whatToDo").text("What would you like to do?");
        var emptycardBody  = $("<div>").addClass("card-body");
        var emptycardlink1  = $("<a>").attr("href", "#").addClass("card-text linkformat").text("Try Scraping new Articles");
        var emptycardlink2  = $("<a>").attr("href", "/savedArticlesPage").addClass("card-text linkformat").text("Go to Saved Articles");
        $(emptycard2).append(emptycardheader2);
        $(emptycardBody).append(emptycardlink1).append("<br>").append(emptycardlink2);
        $(emptycard2).append(emptycardBody);
        $(".articles").append(emptycard2);
    });
    
    $("#clearArticleButtonSaved").on("click", function(event)
    {
        
        event.preventDefault();
        $(".savedArticles").empty();

        $.ajax({
            method: "PUT",
            url: "/updateAll",
            data: {
                saved: false 
            }
        }).then(function(data)
        {
            console.log(data);
        });

        // top card
        var emptycard = $("<div>").addClass("card");
        var emptycardheader = $("<div>").addClass("card-header noArticlesCard").text("Oh no there are no articles");
        $(emptycard).append(emptycardheader);
        $(".savedArticles").append(emptycard).append("<br>"); 

        // bottom card
        var emptycard2 = $("<div>").addClass("card");
        var emptycardheader2 = $("<div>").addClass("card-header whatToDo").text("What would you like to do?");
        var emptycardBody  = $("<div>").addClass("card-body");
        var emptycardlink1  = $("<a>").attr("href", "#").addClass("card-text linkformat").text("Try Scraping new Articles");
        var emptycardlink2  = $("<a>").attr("href", "/savedArticlesPage").addClass("card-text linkformat").text("Go to Saved Articles");
        $(emptycard2).append(emptycardheader2);
        $(emptycardBody).append(emptycardlink1).append("<br>").append(emptycardlink2);
        $(emptycard2).append(emptycardBody);
        $(".savedArticles").append(emptycard2);
    });

    $(document).on("click", ".savebutton", function(event)
    {
        // removes article card from home and changes saved state to true.
        event.preventDefault();
        $("#" + this.id).remove();
        $.ajax({
            method: "PUT",
            url: "/savedArticles/" + this.id,
            data: {
                saved: true 
            }
        }).then(function(data)
        {

        });
    });

    $(document).on("click", ".deleteButton", function(event)
    {
        // removes article card from saved articles and changes saved state to false.
        event.preventDefault();
        $("#" + this.id).remove();
        $.ajax({
            method: "PUT",
            url: "/savedArticles/" + this.id,
            data: {
                saved: false 
            }
        }).then(function(data)
        {
        
        });
    });

    $(document).on("click", ".articleNotesButton", function(event)
    {
        event.preventDefault();
        articleID = this.id;
    
        $.get("/savedArticleTitle/" + this.id, function(data)
        {
            $(".modal-title").text("Notes for " + '"' + data.title + '"' + "Article");
        });

        $.get("/savedArticleNotes/" + this.id, function(data)
        {
            var noteContent = $("<p>").text(JSON.stringify(data.note.body));
            var noteDeleteButton = $("<button>").addClass("btn btn-danger cardHeaderButton noteDeleteButton").attr("id", data.note._id).text("X");
            $("#notes").append(noteContent).append(noteDeleteButton);
        }).catch(function(err)
        {
            if(err)
            {
                var noNotes = $("<p>").text("no Notes found");
                $("#notes").append(noNotes);
            };
        });
    });

    // creates cards for saved articles
    $("#viewSavedArticles").on("click", function(event)
    {
        event.preventDefault();
        $(".savedArticles").empty();

        $.get("/savedArticles", function(articles)
        {
            articles.forEach(element =>
                {
                    var card = $("<div>").addClass("card").attr("id", element._id);
                    var cardHeader = $("<div>").addClass("card-header");
                    var headerLink = $("<a>").attr("href", element.link).text(element.title);
                    var deletebutton = $("<button>").addClass("btn btn-danger cardHeaderButton deleteButton").attr({"href": "#", "id" : element._id}).text("Delete From Saved");
                    var articleNotes = $("<button>").addClass("btn btn-info cardHeaderButton articleNotesButton ").attr({"href": "#", "id" : element._id, "data-toggle" : "modal", "data-target" : "#ArticleNotes"}).text("Article Notes");
                    var cardBody = $("<div>").addClass("card-body");
                    var cardParagraph  = $("<p>").addClass("card-text").text("No Summary for the Article found");
                    $(cardHeader).append(headerLink).append(articleNotes).append(" ").append(deletebutton);
                    $(card).append(cardHeader);
                    $(cardBody).append(cardParagraph);
                    $(card).append(cardBody);
                    $(".savedArticles").append(card).append("<br>"); 
                });
        });
        
    });

    $(document).on("click", "#saveNote", function(event)
    {
        event.preventDefault();

        $.ajax({
            method: "POST",
            url: "/addNote/" + articleID,
            data: {
              // Value taken from title input
              title: $("#noteTitle").val().trim(),
              // Value taken from note textarea
              body: $("#noteBody").val().trim()
            }
          }).then(function(articleNote) {
              console.log(articleNote);
            });

            $("#noteTitle").val("");
            $("#noteBody").val("");
    });

    $("#closeX").on("click", function(event)
    {
        event.preventDefault();
        $("#notes").empty();
    });
});