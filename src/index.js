document.addEventListener('DOMContentLoaded', () => {
  let addToy = false
  const url = 'http://localhost:3000/toys'
  const toyCollection = document.querySelector('#toy-collection')
  const toyForm = document.querySelector('.add-toy-form')

  // Grabbing the info from the toy database and making div's for them

  function toyInfo (toy) {
    const div = document.createElement('div')
    div.className = 'card'

    const toyName = document.createElement('h2')
    toyName.innerHTML = toy.name

    const toyImg = document.createElement('img')
    toyImg.src = toy.image
    toyImg.className = 'toy-avatar'

    const likes = document.createElement('p')
    likes.innerHTML = `${toy.likes} Likes`

    const button = document.createElement('button')
    button.className = 'like-btn'
    button.id = toy.id
    button.innerHTML = 'Like <3'

    // Adding a patch to the like button to update number of likes for every toy

    button.addEventListener('click', (e) => {
      e.preventDefault()

      const thisButton = e.target.id

      fetch(`http://localhost:3000/toys/${thisButton}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          likes: `${toy.likes++}`
        })
      })
        .then(resp => resp.json())
        .then(data => {
          likes.innerHTML = `${data.likes} Likes`
        })
    })

    div.append(toyName, toyImg, likes, button)
    toyCollection.append(div)
  }

  // Fetching the URL and creating the table of toys using toyInfo()

  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      for (const toy of data) {
        toyInfo(toy)
      }
    })

  // Open the dropdwon menu

  const addBtn = document.querySelector('#new-toy-btn')
  const toyFormContainer = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyFormContainer.style.display = 'block'
    } else {
      toyFormContainer.style.display = 'none'
    }
  })

  // Submit a new toy

  toyForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const newName = e.target.name.value
    const newImg = e.target.image.value

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: newName,
        image: newImg,
        likes: 0
      })
    })
      .then(resp => resp.json())
      .then(newToy => {
        toyInfo(newToy)
      })
  })
})
