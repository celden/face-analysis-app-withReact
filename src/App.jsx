import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import * as faceapi from "face-api.js";

function App() {
  const cardRef = useRef();
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const imgRef = useRef();

  // Modelleri yükle
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      console.log("Modeller yüklendi");
    };
    loadModels();
  }, []);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#1e1e1e", // kartın arka planı (şık görünüm için)
      scale: 2,                   // daha yüksek çözünürlük
    });
    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "analiz-karti.png";
    link.click();
  };

  // Fotoğraf seçildiğinde
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult(null);
    }
    e.target.value = "";
  };

  // Tahmin yap
  const analyzeFace = async () => {
    if (!imgRef.current) return;

    const detections = await faceapi
      .detectSingleFace(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withAgeAndGender()
      .withFaceExpressions();

    if (detections) {
      const { age, gender } = detections;
      const dominantExpression = Object.entries(detections.expressions).sort(
        (a, b) => b[1] - a[1]
      )[0][0];

      setResult({ age: Math.round(age), gender, expression: dominantExpression });
    } else {
      alert("Yüz tespit edilemedi. Fotoğrafı daha net yüklemeyi deneyin 🙏");
    }
  };

  // Komik karakter üret
  const generateCharacter = () => {
    if (!result) return "";
    const { age, gender, expression } = result;

    const genderText = gender === "male" ? "bir adam" : "bir kadın";
    const cinsiyet = gender === "male" ? "Erkek" : "Kadın"
    const moodMap = {
      happy: "neşeli",
      sad: "hüzünlü",
      angry: "öfke dolu",
      surprised: "şaşkın",
      neutral: "sakin",
    };

    const mood = moodMap[expression] || expression;
    const malenicknames = [
      "Turbo", "Yıldırım", "Gölge", "Kasırga", "Şimşek", "Kartal", "Serseri", "Kaptan", "Korsan", "Asil",
      "Panter", "Yırtıcı", "Komutan", "Bozkurt", "Volkan", "Avcı", "Yolcu", "Baron", "Kurt Adam", "Çelik Adam",
      "Karpuzcu", "Köfteci", "Limoncu", "Tostçu", "Paspas Bey", "Mayonez Avcısı", "Robot Dayı",
      "Ninja", "Kafası Güzel", "Patates Kralı", "Dondurma Ninja", "Makarna Lordu", "Sakızcı", "Çılgın Tavuk",
      "Lahmacun Sevdalısı", "Mekanın Sahibi", "Turşucu", "Mısır Kralı", "Döner Uzmanı",
      "Gölgelerin Efendisi", "Sessiz Vuruş", "Altın Yumruk", "Kod Avcısı", "Pixel Canavarı",
      "Yapay Zeka", "Hayalet", "Zihin Okuyucu", "Deli Mühendis", "Takla Ustası",
      "NoScope Baba", "Headshot Reis", "Hackerman", "Zehirli Bıçak", "Son Samuray", "Uzay Savaşçısı",
      "Çaykolik", "Lahmacun Reis", "Taksici Remzi", "Ekmek Arası", "Çiğköfte Ninja", "Tavuk Dönerci",
      "Hamsi Lordu", "Bakkal Samet", "Zurna Kralı", "Simitçi Dayı", "Sucuk Ustası", "Şalgamcı Hüseyin",
      "Çaycı Murat", "Kebapçı Ali", "Köfte Kralı", "Dönerci Reis",
      "Xeno", "Blaze", "ShadowX", "Nova", "Vortex", "Echo", "Frost", "Reaper", "Zed", "Rogue",
      "Hex", "Bolt", "Zero", "Crash", "Blade", "Specter",
      "Pofuduk", "Tatlı Bela", "Ponçik", "Zıp Zıp", "Kurabiye Canavarı", "Karamel Adam", "Mini Barbar", "Şirin Dev",
      "Kral Ahmet", "Manyak Murat", "Turbo Selim", "Karpuzcu Mehmet",
      "Köfteci Osman", "Çılgın Ali", "Tostçu Enes", "Robot Deniz", "Pixel Hasan", "Kasırga Mustafa"
    ];


    const femalenicknames = [
      "Kasırga Kız", "Yıldırım Kadın", "Gölge Kraliçe", "Şimşek", "Asil Prenses", "Kaptan Kız",
      "Kartal Göz", "Fırtına", "Cesur Yürek", "Korsan Kız", "Gizemli Güç", "Luna", "Nova", "Blaze",
      "Karpuzcu Hatun", "Köfteci Kadın", "Limoncu Abla", "Tostçu Kız", "Prenses", "Paspas Kraliçe",
      "Mayonez Avcısı", "Robot Teyze", "Ninja Kız", "Patates Kraliçesi", "Dondurma Prensesi",
      "Makarna Kadın", "Sakızcı Abla", "Çılgın Tavuk Kız", "Lahmacun Kraliçesi", "Tatlı Bela Kadın",
      "Gölgelerin Kraliçesi", "Sessiz Vuruş", "Altın Pençe", "Uzaylı Kız", "Kod Avcısı",
      "Pixel Savaşçısı", "Yapay Zeka", "Hayalet Kız", "Zihin Okuyucu", "Deli Mühendis Kadın",
      "Uzay Prensesi", "Takla Ustası", "Sihirli Kız", "Gizemli Avcı", "Gölge Dansçısı",
      "Çaykolik Abla", "Lahmacun Kraliçesi", "Ekmek Arası Kadın", "Çiğköfte Ninja Kız",
      "Tavuk Dönerci Abla", "Hamsi Kraliçesi", "Bakkal Teyze", "Zurna Kadın", "Gönül Abla",
      "Simitçi Kadın", "Teyze 3000", "Şalgamcı Hatun", "Tatlıcı Kız", "Kumpirci Kraliçe",
      "Luna", "Nova", "Blaze", "Echo", "Frost", "ShadowX", "Stella", "Astra", "Zia", "Vortex", "Zenya", "Flare",
      "Pofuduk", "Minnoş", "Bal Köpüğü", "Şekerpare", "Tatlı Bela", "Ponçik", "Zıp Zıp",
      "Kurabiye Canavarı", "Papatya Kız", "Karamel Kız", "Çilekli Rüya", "Şirin Savaşçı",
      "Kraliçe Ayşe", "Uzaylı Elif", "Piksel Buse", "Karpuzcu Merve", "Ninja Derya",
      "Çılgın Zeynep", "Turbo Selin", "Robot İrem", "Pixel Hande", "Kasırga Melis"
    ];


    const malerandomNick = malenicknames[Math.floor(Math.random() * malenicknames.length)];
    const femalerandomNick = femalenicknames[Math.floor(Math.random() * femalenicknames.length)];

    const nick = gender === "male" ? malerandomNick : femalerandomNick;

    return `${age} yaşında ${mood} ${genderText}... Piyasada ${nick} olarak biliniyor! ⚡`;
  };

  return (
    <div style={{ textAlign: "center", padding: 10 }}>
      <div ref={cardRef} style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>
        <h1>Karakter Analizi 🕵️‍♂️</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          id="imageInput"
          style={{ display: "none" }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 20,
            marginTop: 20,
          }}
        >
          {/* Sol Kutu */}
          <div style={{ flex: "1 1 300px", minWidth: 250, maxWidth: 350 }}>
            {!image ? (
              <div
                onClick={() => document.getElementById("imageInput").click()}
                style={{
                  width: "100%",
                  height: 300,
                  border: "2px dashed #aaa",
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 80,
                  color: "#aaa",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#555")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#aaa")}
              >
                +
              </div>
            ) : (
              <div>
                <img
                  onClick={() => document.getElementById("imageInput").click()}
                  style={{
                    width: "100%",
                    border: "2px dashed #aaa",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "0.3s",
                  }}
                  ref={imgRef}
                  src={image}
                  alt="uploaded"
                  crossOrigin="anonymous"
                />
                <div>
                  <button onClick={analyzeFace} style={{ marginTop: 10 }}>
                    Yüzü Analiz Et
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sağ Kutu */}
          {result && (
            <div
              style={{
                flex: "1 1 300px",
                minWidth: 250,
                maxWidth: 350,
                textAlign: "left",
              }}
            >
              <h3>🧠 Analiz Sonucu</h3>
              <p>
                Yaş Tahmini: <span style={{ fontWeight: "bold" }}>{result.age}</span>
              </p>
              <p>
                Cinsiyet: <span style={{ fontWeight: "bold" }}>{result.gender}</span>
              </p>
              <p>
                Duygu: <span style={{ fontWeight: "bold" }}>{result.expression}</span>
              </p>

              <h2>🎭 Karakterin:</h2>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                {generateCharacter()}
              </p>

              <p
                style={{
                  fontSize: 12,
                  opacity: 0.7,
                  textAlign: "left",
                  marginTop: 20,
                }}
              >
                karakteranalizi.site
              </p>
            </div>
          )}
        </div>


      </div>

      {/* İndirme Butonu */}
      {result && (
        <div style={{ marginTop: 20 }}>
          <button onClick={downloadCard}>📥 Kartı İndir (PNG)</button>
        </div>
      )}
    </div>
  );



}

export default App;
