(async function load() {
  const BASE_API = 'https://yts.am/api/v2/'
  const getData = async function (url) {
    const response = await fetch(`${BASE_API}list_movies.json?genre=${url}`)
    const data = await response.json()
    return data;
  }

  const getQueryterm = async function (term) {
    const response = await fetch(`${BASE_API}list_movies.json?limit=1&query_term=${term}`)
    const data = await response.json()
    return data;
  }

  const $search = document.getElementById('search');

  const actionList = await getData('action');
  const dramaList = await getData('drama');
  const comedyList = await getData('comedy');
  const $actionContainer = document.getElementById('action');
  const $comedyContainer = document.getElementById('comedy');
  const $dramaContainer = document.getElementById('drama');
  const $modal = document.getElementById('modal');
  const $hideModal = document.getElementById('hide-modal');
  const $overlay = document.getElementById('overlay');
  const $featuring = document.getElementById('featuring');
  const $featuringSpace = document.getElementById('featuring-space');
  const $loader = document.createElement('img');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImg = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  function setAttributes ($element, attributes) {
    for (const attribute in attributes) {
      $element.setAttribute(attribute, attributes[attribute]);
    }
  }

  function featuringTemplate (movie) {
    return (`
      <div class="featuring-image">
      <img class="img-responsive" src="${movie.medium_cover_image}" alt="">
      </div>
      <div class="featuring-content">
      <p class="featuring-title">Pelicula Encontrada</p>
      <h1 class="featuring-album">${movie.title}</h1>
      </div>
      `)
    }

  $search.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    $featuring.classList.remove('hidden');
    $featuringSpace.classList.remove('hidden');
    setAttributes($loader, {
      src: 'images/loader.gif',
      width: '150',
      height: '100'
    })
    $featuring.append($loader)

    const movieData = new FormData($search);
    const {
      data: {
        movies: movies
      }
    } = await getQueryterm(`${movieData.get('name')}`);
    const HTMLFeaturing = featuringTemplate(movies[0]);

    $featuring.innerHTML = HTMLFeaturing;

  })

  function videoItemTemplate(movie, category) {
    return (
    `<div class="primaryPlaylistItem" data-id=${movie.id} data-category=${category}>
    <div class="primaryPlaylistItem-image">
    <img src="${movie.medium_cover_image}">
    </div>
    <h4 class="primaryPlaylistItem-title">
    ${movie.title}
    </h4>
    </div>`)
  }

  function movieElement(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  function showModal(element) {
    element.addEventListener('click', (ev) => {
      $overlay.classList.remove('hidden');
    })
    $hideModal.addEventListener('click', (ev) => {
      $overlay.classList.add('hidden');
    })
  }

  function renderMovielist(list, $container, category) {
    list.data.movies.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieItem = movieElement(HTMLString);
      $container.append(movieItem);
      showModal(movieItem);
    })
  }

  renderMovielist(actionList, $actionContainer, 'action');
  renderMovielist(dramaList, $dramaContainer, 'drama');
  renderMovielist(comedyList, $comedyContainer, 'comedy');

})()
