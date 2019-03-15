var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");

var router = express.Router();

var db = require("../models");

// home
router.get("/", function(req, res) {
  res.render("index");
});

// saved articles page
router.get("/savedArticlesPage", function(req, res) {
  res.render("savedArticles");
});

// scrape function
router.get("/scrape", function(req, res) {
  db.Article.deleteMany({}, function() {
    // get html from huffpost website
    axios
      .get("https://www.huffpost.com/")
      .then(function(response) {
        // load huffpost html into cheerio
        var $ = cheerio.load(response.data);

        var articleArray = [];

        // loop through the html to find the element specified
        $("div.card__headline__text").each(function(i, element) {
          var result = {
            title: $(element).text(),
            link: $(element)
              .parent()
              .attr("href")
          };
          articleArray.push(result);
        });
        return articleArray;
      })
      .then(function(dataArray) {
        //   creates documents in database from the data returned from the article
        db.Article.create(dataArray)
          .then(function(dbResp) {
            res.json(dbResp);
          })
          .catch(function(err) {
            if (err) throw err;
          });
      });
  });
});

//updateing saved articles 
router.put("/savedArticles/:id", function(req, res)
{
  db.Article.findByIdAndUpdate(req.params.id, req.body, function(data){
    res.json(data);
  });
});

router.get("/savedArticles", function(req, res)
{
  db.Article.find({saved: true}).then(function(articles)
  {
    res.json(articles);
  });
});

router.get("/savedArticleTitle/:id", function(req, res)
{
  db.Article.findById(req.params.id, "title", function(err, data)
  {
    if(err) throw err;
    res.json(data);
  });
});

router.get("/savedArticleNotes/:id", function(req, res)
{
  db.Article.findOne({_id: req.params.id}).populate("note").then(function(dbNote)
  {
    res.json(dbNote);
  }).catch(function(err)
  {
    res.json(err);
  });
});

router.put("/updateAll", function(req, res)
{
  db.Article.updateMany({}, req.body, function(updateData)
  {
    res.json(updateData);
  });
});

router.post("/addNote/:id", function(req, res)
{ 
  db.Note.create(req.body).then(function(dbNote)
  {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
  }).then(function(dbArticle)
  {
    res.json(dbArticle);
  }).catch(function(err)
  {
    res.json(err);
  });
});

module.exports = router;
