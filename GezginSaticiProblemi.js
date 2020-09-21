document.addEventListener("DOMContentLoaded",()=>{
    const sehirSayisi=25;
    const bireyMiktari=10000;
    const genMiktari=40;
    const hayattaKalmaOranı=0.4;
    const mutasyonOranı=0.2;
    var nokta;

    var canvas=document.getElementById("cnvs");
    var ctx=canvas.getContext("2d");length
    canvas.width=295;
    canvas.height=295;

    var eniyi_Mesafe = document.getElementById ("eniyiMesafe");
	var baslangic_Nesil = document.getElementById ("baslangicNesil");
	var uzun_Mesafe = document.getElementById ("uzunMesafe");
    var ortalama_Mesafe = document.getElementById ("ortalamaMesafe");
    
    function temizleHarita(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();
        ctx.lineWidth="0.1";
        ctx.strokeStyle="black";
        ctx.setLineDash([1,1]);
        

        for(let i=0; i<20; i++){
            ctx.moveTo(20*i,0);
            ctx.lineTo(20*i,295);
            ctx.stroke();
        }
        
        for(let i=0; i<20; i++){
            ctx.moveTo(0,20*i);
            ctx.lineTo(295,20*i);
            ctx.stroke();
        }
        ctx.fill();
    }

    function harita(noktaAX,noktaAY,noktaBX,noktaBY){
        ctx.beginPath();
        ctx.lineWidth="3.5";
        ctx.strokeStyle="blue";
        ctx.moveTo(noktaAX,noktaAY);
        ctx.lineTo(noktaBX,noktaBY);
        ctx.stroke();
        ctx.fillStyle="green";
        ctx.arc(noktaBX, noktaBY, 4, 0, 2*Math.PI);
		return;
    }

    function sehirGoster(){
        temizleHarita();
        ctx.fillStyle="blue";
        for(let i=1; i<sehirSayisi-1;i++){
            ctx.beginPath();
            ctx.arc(nokta.getSehir(i).getX(),nokta.getSehir(i).getY(),4, 0, 2*Math.PI);
            ctx.fill();
        }

        ctx.beginPath();
		ctx.fillStyle = "yellow";
		ctx.arc(nokta.getSehir(0).getX(),nokta.getSehir(0).getY(),6, 0, 2*Math.PI);
        ctx.fill();
        
        ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.arc (nokta.getSehir(sehirSayisi-1).getX(), nokta.getSehir(sehirSayisi-1).getY(), 6, 0, 2*Math.PI);
		ctx.fill();
		return;
    }

    document.getElementById("sehirler").addEventListener("click",sehirUret = () => {
      eniyi_Mesafe.innerHTML ="-"
	  baslangic_Nesil.innerHTML ="-"
	  uzun_Mesafe.innerHTML ="-"
      ortalama_Mesafe.innerHTML ="-"
      nokta=new  durumNoktasi(sehirSayisi);
      sehirGoster();
      return;
    });


document.getElementById("baslangic").addEventListener("click",optimizasyonBaslat= () => {
    if(nokta==undefined){
        alert("Öncelikle şehirleri oluşturunuz!!");
        return;
    }
    document.getElementById("baslangic").disabled = true;
    document.getElementById("sehirler").disabled = true;
    
    let  populasyonNufus = new populasyon();

    let uretimSayac=0;
    let maxNot=0;
    let ortalamaDerece=0;

    setTimeout(main=()=>{
        setTimeout(()=> {
            if(genMiktari<=uretimSayac){
                document.getElementById("baslangic").disabled = true;
                document.getElementById("sehirler").disabled = true;
                return;
            }

            not=mevcutPopulasyon(populasyonNufus);
            if(maxNot<=(Math.max(...not))){
                maxNot=Math.max(...not);
            }

            let topla=0;
            for (let i = 0; i < not.length; i++)
                    topla+=not[i];
                    
                    ortalamaDerece=topla/not.length;
                    eniyi_Mesafe.innerHTML =Math.min(...not);
	                baslangic_Nesil.innerHTML =uretimSayac;
	                uzun_Mesafe.innerHTML =maxNot;
                    ortalama_Mesafe.innerHTML =ortalamaDerece;

                    populasyonNufus=caprazlama(populasyonNufus,not);
                    populasyonNufus=mutasyon(populasyonNufus);
                    uretimSayac++;

                    let minNot=Math.min(...not);
                    let durum=not.indexOf(minNot);
                    sehirGoster();
                    let macark=populasyonNufus[durum];
                    for(let i=0; i<sehirSayisi-1;i++){
                        harita(nokta.getSehir(macark[i]).getX(),
                        nokta.getSehir(macark[i]).getY(), nokta.getSehir(macark[i+1]).getX(), nokta.getSehir(macark[i+1]).getY());

                    }
                    main();
                }, 10);
            }, 0);
            return;
    });

    function durumNoktasi(miktar){
        let sehirler=new Array();
        for(let i=0; i<miktar;i++){
            let yeniSehir=new sehir();
            while(sehirler.includes(yeniSehir)){
                yeniSehir=new sehir();
            }
            sehirler.push(yeniSehir);
        }
        this.getSehir=(x)=>{
            return(sehirler[x]);
        }
        return;
    }

    function sehir(){
        this.x = Math.round (Math.random()*19)*15;
		this.y = Math.round (Math.random()*19)*15;
		this.getX = () => {
			return(this.x);
		};
		this.getY = () => {
			return(this.y);
		};
    }
    
    function populasyon(){
        let yeniPopulasyon=new Array();
        while(yeniPopulasyon.length<bireyMiktari){
            let kromozom=new Array();
            kromozom.push(0);

            for(let i=0; i<sehirSayisi-2;i++){
                let yeniGen=Math.round(Math.random()*sehirSayisi);
                while (kromozom.includes(yeniGen) || yeniGen <= 0 || yeniGen >= sehirSayisi-1){
					yeniGen = Math.round(Math.random()*sehirSayisi);
				}
				kromozom.push(yeniGen);
            }
            kromozom.push(sehirSayisi-1);
            if(!yeniPopulasyon.includes(kromozom)){
                yeniPopulasyon.push(kromozom);
            }

          }
          return (yeniPopulasyon);
        }
        function mevcutPopulasyon(pop){
            let not=new Array();
            pop.forEach ((ind) => {
                let mesafe = 0;
                for (let i = 1; i < ind.length; i++) {
                    let x1 = nokta.getSehir(ind[i-1]).getX();
                    let x2 = nokta.getSehir(ind[i]).getX();
                    let y1 = nokta.getSehir(ind[i-1]).getY();
                    let y2 = nokta.getSehir(ind[i]).getY();
                    mesafe += Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                }
                not.push(mesafe);
            });
            return (not);
        }
        function caprazlama(pop,not){
            let yeniBireyMiktarı=pop.length-(pop.length*hayattaKalmaOranı);
            let hayattaKalanBireyler=pop.length-yeniBireyMiktarı;

            let sıralıNot=not.slice().sort((a,b)=>{
                return (a - b);
            });

            let sıralama=not.slice().map((v)=>{
                return (sıralıNot.indexOf(v));

            });

            let yeniKromozomlar=new Array();
            for(let i=0;i<pop.length;i++){
                if(sıralama[i]<hayattaKalanBireyler){
                    yeniKromozomlar.push(pop[i]);
                }
            }

            while (yeniKromozomlar.length < bireyMiktari) {
                let gecisNoktaları = getRandom (3, 26);
                let baba = getRandom (0, hayattaKalanBireyler-1);
                let anne = getRandom (0, hayattaKalanBireyler-1);
                let cocuk = yeniKromozomlar[baba].slice (0, gecisNoktaları);
                yeniKromozomlar[anne].forEach ((gen) => {
                    if (!cocuk.includes(gen)) {
                        cocuk.push (gen);
                    }
                });
                if (!yeniKromozomlar.includes (cocuk)) {
                    yeniKromozomlar.push (cocuk);
                }
            }
            return (yeniKromozomlar);
        }


        function mutasyon (pop) {
            pop.forEach ((bireysel) => {
                for (let i = 0; i < bireysel.length; i++) {
                    let prob = Math.random ();
                    if (prob <= mutasyonOranı) {
                        let gen0 = i;
                        let gen1 = getRandom (0, bireysel.length-1);
                        while (gen1 != gen0) {
                            gen1 = getRandom (0, bireysel.length);
                        }
                        bireysel[gen0] = bireysel[gen1];
                        bireysel[gen1] = bireysel[gen0];
                    }
                }
            });
            return (pop);
        }


        function getRandom (min, max) { 
            min = Math.ceil (min);
            max = Math.floor (max);
            return (Math.floor(Math.random() * (max - min + 1)) + min);
        }


});