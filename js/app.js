var newsAPIData = [];
var nytimesData = [];
var guardianData = [];
var news = [];
var mixnews = false;

function newsAPI() {
  $("#popUp").removeClass("hidden").addClass("loader");
  $.ajax({
    url: "https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=aa9972fef0a040d9ab10f8e5bd396e95",
    type: "get",
    success: function (res) {
      res.articles.forEach(element => {
        var obj = {
          title: element.title,
          urlToImage: element.urlToImage,
          webUrl: element.url,
          source: element.author,
          content: element.content
        };
        newsAPIData.push(obj);
      });

      if (!mixnews) {
        newsAPIData.forEach(el => {
          append(el);
        })
      }
    },
    error: function (xhr, status, err) {
      alert("News API is not working!!")
    }
  });
}

function nytimes() {
  $("#popUp").removeClass("hidden").addClass("loader");
  $.ajax({
    url: "https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=XmQHltEy6pl7LgXLDe87fU1JB9zj0Bdu",
    type: "get",
    success: function (res) {
      res.results.forEach(element => {
        var obj = {
          title: element.title,
          urlToImage: element.thumbnail_standard,
          webUrl: element.url,
          source: element.source,
          content: element.abstract
        };
        nytimesData.push(obj);

      });

      if (!mixnews) {
        nytimesData.forEach(el => {
          append(el);
        })
      }
    },
    error: function (xhr, status, err) {
      alert("News API is not working!!")
    }
  });
}

function guardian() {
  $("#popUp").removeClass("hidden").addClass("loader");
  $.ajax({
    url: "https://content.guardianapis.com/search?api-key=83c8984e-05be-4c7a-9a89-60a8b22c4b6e",
    type: "get",
    success: function (res) {
      res.response.results.forEach(element => {
        var obj = {
          title: element.webTitle,
          urlToImage: "https://cdn3.iconfinder.com/data/icons/ballicons-reloaded-free/512/icon-70-512.png",
          webUrl: element.webUrl,
          source: `${element.sectionName} ${element.pillarName}`,
          content: "There is no description for this article."
        };
        guardianData.push(obj);
      });

      if (!mixnews) {
        guardianData.forEach(el => {
          append(el);
        })
      }
    },
    error: function (xhr, status, err) {
      alert("News API is not working!!")
    }
  });
}

function append(element) {
  $('#main').append(
    `<article class="article">
          <section class="featuredImage">
            <img src="${element.urlToImage}" alt="" />
          </section>
          <section class="articleContent">
            <a href="#" id="title"><h3 >${element.title}</h3></a>
            <h6>${element.source}</h6>
          </section>
          <section class="impressions">
            News
          </section>
          <div class="clearfix"></div>
        </article>`
  );

  $("#popUp").removeClass("loader").addClass("hidden");

  $(".articleContent a").click(function () {
    $("#popUp").removeClass("hidden").removeClass("loader");
    if ($(this).text() === element.title) {
      $('#popUp').empty();
      $('#popUp').append(
        `<a href="#" class="closePopUp">X</a>
             <div class="container">
                <h1>${element.title}</h1>
                <p>${element.content}</p>
              <a href="#" class="popUpAction" target="_blank">Read more from source</a>
            </div>`
      );
      $(".popUpAction").attr("href", element.webUrl)
    }
    $(".closePopUp").click(function () {
      $("#popUp").attr("class", "loader hidden");
    });
  });
}
function compare(a, b) {
  if (a.title < b.title)
    return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}

function setNews() {
  news = newsAPIData.concat(nytimesData).concat(guardianData);
}

function mixNews() {
  setNews();
  news = news.sort(compare);
  news.forEach(el => {
    append(el);
  })
}

$(document).ready(function () {

  newsAPI();
  nytimes();
  guardian();

  $("#home").click(function () {
    $('#main').empty();
    mixnews = true;
    mixNews()
  });

  $("#newsAPI").click(function () {
    mixnews = false;
    $('#main').empty();
    newsAPI();
  });

  $("#nytimes").click(function () {
    mixnews = false;
    $('#main').empty();
    nytimes();
  });

  $("#guardian").click(function () {
    mixnews = false;
    $('#main').empty();
    guardian();

  });
  
  $('#search a').click(function () {
    $('#search').toggleClass('active');
    $('#search input').on('keyup', function () {
      setNews();
      var value = $("input[name=name]").val().toLowerCase();
      news.forEach(el => {
        if(el.title.toLowerCase().indexOf(value) != -1){
          console.log(el.title)
        }
      })
    });

  })

});