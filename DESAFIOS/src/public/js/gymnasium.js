const listImages = document.getElementById("imagesList");


const images = [
    "https://www.semana.com/resizer/cEwPxtGZ4ZQQEuuX2_9C_bbCGrc=/1280x720/smart/filters:format(jpg):quality(80)/cloudfront-us-east-1.images.arcpublishing.com/semana/RPMFHE2GXRGSPASROL66G3VUY4.jpg",
    "https://www.eluniverso.com/resizer/uKNaE7TZ9IpD2Ya6Th_tAkJjh80=/1005x670/smart/filters:quality(70)/cloudfront-us-east-1.images.arcpublishing.com/eluniverso/YR4M3ZPEZBCJBJT2N5FUMPD36A.jpg",
    "https://criteriosdigital.com/wp-content/uploads/2022/11/CortesiaKAPPA.jpg",
    "https://lh5.googleusercontent.com/p/AF1QipONEWUZo-A8fvNDi0TO2s3b1kIPhX_3zWYY9rMY",
    "https://lh4.googleusercontent.com/PQWaz6fXzPoe_PvRVF0jQIkHoxI-T9_lzbjmg_rK-2suaYecGoaTFvPY_Uq3mcUR",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkEtmxPRp6ZDoKxi2eDxDL3on_TTABJg_L6g&usqp=CAU",
    "https://colortexperu.com.pe/wp-content/uploads/2020/09/3.-REEBOK.jpg",
    "https://modularls34.es/wp-content/uploads/2017/05/diseno-del-espacio-interior.jpg",
]


images.forEach(image => {
    const box = document.createElement("div");
    box.className = "listImageBox";
    box.innerHTML = `<img src=${image} alt="" />`
    listImages.append(box)
})
