const listImagesContainer = document.getElementById("imagesContainer")

const imagesContainer = [
    "https://i0.wp.com/blog.smartfit.com.mx/wp-content/uploads/2019/03/SF_MAR19_Blog_DIA_19.png?fit=1200%2C1000&ssl=1",
    "https://cenie.eu/sites/default/files/sin_titulo-1_2.jpg",
    "https://i0.wp.com/blog.smartfit.com.mx/wp-content/uploads/2021/06/maquinas-de-gimnasio-1.jpg?fit=1200%2C675&ssl=1",
    "https://www.cmdsport.com/app/uploads/2016/04/feria-fitness.jpg",
    "https://images.neventum.com/posts/2016/97/thumb1024/GymFactoryenIfema.jpg",
    "https://www.rocfit.com/wp-content/uploads/2018/03/ferias-de-fitness-de-2018-scaled.jpg",
    "https://mercadofitness.com/ar/wp-content/uploads/2021/08/GFitness-Iquique-Chile.jpg",
    "https://img.interempresas.net/fotos/398939.jpeg",
]

imagesContainer.forEach(item => {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${item} alt=""/>`
    listImagesContainer.append(figure);
})