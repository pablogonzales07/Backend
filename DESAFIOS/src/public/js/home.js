//I bring the elements I need
const servicesContainer = document.getElementById("servicesContainer");
const buttonLogout = document.getElementById("buttonLogout");
const purchasesContainer = document.getElementById("purchasesContainer");

//I build an array with all categories
const categoriesProducts = [
  {
    id: 0,
    title: "Dumbbells",
    img: "https://entrenamientosfuncionales.com/wp-content/uploads/2022/05/ejercicios-de-hombro-con-mancuernas-gym.jpg",
  },
  {
    id: 1,
    title: "Shoes",
    img: "https://img01.ztat.net/article/spp-media-p1/1e0a964bcd41493bb2c06b62e6248080/cde4e1c7897c4a9d820d2ed05197702d.jpg?imwidth=300&filter=packshot",
  },
  {
    id: 2,
    title: "Machines",
    img: "https://stylelovely.com/wp-content/uploads/2020/01/gym-abdominales.jpg",
  },
  {
    id: 3,
    title: "T-shirts",
    img: "https://img.freepik.com/fotos-premium/pareja-tiro-completo-haciendo-ejercicios-entrenamiento_23-2150470977.jpg?w=360",
  },
  {
    id: 4,
    title: "Bars",
    img: "https://m.media-amazon.com/images/I/4146j4t2zsL._SL500_.jpg",
  },
  {
    id: 5,
    title: "Thermals",
    img: "https://ae01.alicdn.com/kf/Hbc31324392e347abbb72ccb39b3f14272/Camiseta-t-rmica-larga-mangas-ajustadas-para-hombre-ropa-interior-de-compresi-n-para-correr-gimnasio.jpg",
  },
  {
    id: 6,
    title: "Discs",
    img: "https://www.akonfitness.com/wp-content/uploads/2022/11/72PX-9-800x960.jpg",
  },
  {
    id: 7,
    title: "Training Accessories",
    img: "https://m.media-amazon.com/images/I/61oXKgwQ4tL._AC_UF350,350_QL80_.jpg",
  },
];

//I scroll through my array and insert each item in a div to display it in the view.
categoriesProducts.forEach((category) => {
  const boxCategory = document.createElement("div");
  boxCategory.className = "boxService";
  boxCategory.innerHTML = `
                            <figure>
                                <img src="${category.img}"/>
                            </figure>
                            <h3>${category.title}</h3>
                            <button>know more</button>
                           `;
  servicesContainer.append(boxCategory);
});

//I use the library Glider for create a carousel
window.addEventListener("load", function () {
  new Glider(document.querySelector(".carouselList"), {
    slidesToShow: 4,
    slidesToScroll: 4,
    draggable: true,
    dots: ".carouselIndicators",
  });
});

//I generate an event to display a sideBar with all user data
document.getElementById("toggleButton").addEventListener("click", function () {
  let sidebar = document.getElementById("sidebar");
  if (sidebar.style.right === "-400px") {
    sidebar.style.right = "0";
  } else {
    sidebar.style.right = "-400px";
  }
});

//I generate an event to close de sideBar
document.getElementById("closeButton").addEventListener("click", function () {
  let sidebar = document.getElementById("sidebar");
  sidebar.style.right = "-400px";
});

//I generate an event to log the user out.
buttonLogout.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/sessions/userLogout", {
      method: "POST",
      credentials: "same-origin",
    });
    const responseData = await response.json();
    if (responseData.status === "Success") {
      alert("You are logged out");
      window.location.replace("/login");
    } else {
      alert("Error logging out");
    }
  } catch (error) {
    console.log(error);
  }
});

//I bring user tickets for show in the view
const getInfoUser = async () => {
  //I bring the user Data
  const responseUser = await fetch("/api/sessions/userProfile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseDataUser = await responseUser.json();
  const userId = responseDataUser.payload.id;

  //I bring the user tickets
  const responseTickets = await fetch(`/api/tickets/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const responseDataTickets = await responseTickets.json();
  const tickets = responseDataTickets.payload;

  if (tickets.length > 0) {
    tickets.forEach((item) => {
      const span = document.createElement("span");
      span.innerHTML = `<p>#${item.code} <b>TOTAL: ${item.amount}&pound;</b></p>`;
      purchasesContainer.append(span);
    });
  } else {
    purchasesContainer.innerHTML = `<div class="notPurchases"> 
                                    <p>At the moment no purchase has been registered</p>
                                    <button><a href="/">Go to shop</a></button>
                                  </div
                                  `;
  }

  const premiumUser = document.getElementById("premiumUser");

  if (responseDataUser.payload.role === "User") {
    premiumUser.innerHTML = `
                              <h4>Become a premium user and get many benefits:</h4>
                              <div class="buttonPremiumContainer">
                                <button id="goPremium">Make me premium</button>
                              </div>
                            `;

    const buttonPremiumUser = document.getElementById("goPremium");
    buttonPremiumUser.addEventListener("click", async () => {
      const responsePremiumUser = await fetch(
        `/api/sessions/premium/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseDataPremium = await responsePremiumUser.json();
      if (responseDataPremium.status === "Success") {
        const responseLogOut = await fetch("/api/sessions/userLogout", {
          method: "POST",
          credentials: "same-origin",
        });
        const dataLogOut = await responseLogOut.json();
        if (dataLogOut.status === "Success") {
          alert("Now you are a premium user, please login again");
          window.location.replace("/login");
        }
      }
    });
  }
};

getInfoUser();
