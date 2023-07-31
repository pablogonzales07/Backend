const servicesContainer = document.getElementById("servicesContainer");

const services = [
    {id: 0,title: "Dumbbells", img: "https://entrenamientosfuncionales.com/wp-content/uploads/2022/05/ejercicios-de-hombro-con-mancuernas-gym.jpg"},
    {id: 1,title: "Shoes", img: "https://img01.ztat.net/article/spp-media-p1/1e0a964bcd41493bb2c06b62e6248080/cde4e1c7897c4a9d820d2ed05197702d.jpg?imwidth=300&filter=packshot"},
    {id: 2,title: "Machines", img: "https://stylelovely.com/wp-content/uploads/2020/01/gym-abdominales.jpg"},
    {id: 3,title: "T-shirts", img: "https://img.freepik.com/fotos-premium/pareja-tiro-completo-haciendo-ejercicios-entrenamiento_23-2150470977.jpg?w=360"},
    {id: 4,title: "Bars", img: "https://m.media-amazon.com/images/I/4146j4t2zsL._SL500_.jpg"},
    {id: 5,title: "Thermals", img: "https://ae01.alicdn.com/kf/Hbc31324392e347abbb72ccb39b3f14272/Camiseta-t-rmica-larga-mangas-ajustadas-para-hombre-ropa-interior-de-compresi-n-para-correr-gimnasio.jpg"},
    {id: 6,title: "Discs", img: "https://www.akonfitness.com/wp-content/uploads/2022/11/72PX-9-800x960.jpg"},
    {id: 7,title: "Training Accessories", img: "https://m.media-amazon.com/images/I/61oXKgwQ4tL._AC_UF350,350_QL80_.jpg"},
];


services.forEach(service => {
    const boxService = document.createElement("div");
    boxService.className = "boxService";
    boxService.innerHTML = `
                            <figure>
                                <img src="${service.img}"/>
                            </figure>
                            <h3>${service.title}</h3>
                            <button>know more</button>
                           `;
    servicesContainer.append(boxService);
})

window.addEventListener("load", function() {
    new Glider(document.querySelector('.carouselList'), {
        slidesToShow: 4,
        slidesToScroll: 4,
        draggable: true,
        dots: '.carouselIndicators',
      });
})

document.getElementById("toggleButton").addEventListener("click", function() {
    let sidebar = document.getElementById("sidebar");
    if (sidebar.style.right === "-400px") { 
      sidebar.style.right = "0"; 
    } else {
      sidebar.style.right = "-400px"; 
    }
  });

  document.getElementById("closeButton").addEventListener("click", function() {
    let sidebar = document.getElementById("sidebar");
    sidebar.style.right = "-400px";
  });