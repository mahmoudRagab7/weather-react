import "./App.css";
import { useEffect, useState } from "react";

// MATERIAL UI COMPONENTS
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

// EXTERNAL LIBRARIES
import axios from "axios";
import { useTranslation } from "react-i18next";
import moment from "moment";
import "moment/min/locales";

moment.locale("ar");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();

  // STATES
  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [locale, setLocale] = useState("ar");

  const direction = locale === "ar" ? "rtl" : "ltr";

  //  EVENT HANDLERS
  function handleLanguageClick() {
    if (locale === "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("ll"));
  }

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, []);
  useEffect(() => {
    setDateAndTime(moment().format("ll"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=29.30&lon=30.84&appid=7b4214aae25fed9b375fcfee422ea11d",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        // console.log(Math.round(response.data.main.temp - 272.15));
        console.log(response.data);
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;
        // console.log(min, max, description);
        setTemp({
          number: responseTemp,
          min: min,
          max: max,
          description: description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    return () => {
      console.log("Canceling");
      cancelAxios();
    };
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm" style={{}}>
          {/* CONTENT CONTAINER */}
          <div
            style={{
              display: "flex",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
            dir="rtl"
          >
            {/* CARD */}
            <div
              dir={direction}
              style={{
                background: "rgb(28 52 91 / 36%)",
                color: "white",
                padding: "10px",
                borderRadius: "15px",
                width: "100%",
              }}
            >
              {/* CONTENT */}
              <div>
                {/* CITY & TIME */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "start",
                    boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
                  }}
                  dir={direction}
                >
                  <Typography
                    variant="h2"
                    style={{ marginRight: "20px", fontWeight: "600" }}
                  >
                    {t("Fayoum")}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: "20px" }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/* ===== CITY & TIME ===== */}
                <hr />
                {/* CONTAINER OF DEGREE + CLOUD ICON */}
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {/* DIGREE & DESCRIPTION */}
                  <div>
                    {/* TEMPERTURE */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h1" style={{ textAlign: "right" }}>
                        {temp.number}
                      </Typography>
                      {/* TEMP IMAGE */}
                      <img src={temp.icon} alt="temp icon" />
                      {/* ===== TEMP IMAGE ===== */}
                    </div>
                    {/* ===== TEMPERTURE ===== */}
                    <Typography variant="h6" style={{}}>
                      {t(temp.description)}
                    </Typography>
                    {/* MIN & MAX */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {t("min")}: {temp.min}
                      </h5>
                      <h5 style={{ margin: "0px 5px" }}> | </h5>
                      <h5>
                        {t("max")}: {temp.max}
                      </h5>
                    </div>
                    {/* ===== MIN & MAX ===== */}
                  </div>
                  {/* ===== DIGREE & DESCRIPTION ===== */}
                  <CloudIcon style={{ fontSize: "200px", color: "white" }} />
                </div>
                {/* ===== CONTAINER OF DEGREE + CLOUD ICON ===== */}
              </div>
              {/* ===== CONTENT ===== */}
            </div>
            {/* ===== CARD ===== */}
            {/* TRASNSILATION CONTAINER */}
            <div
              dir={direction}
              style={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
              }}
            >
              <Button
                variant="text"
                style={{ color: "white", marginTop: "10px" }}
                onClick={handleLanguageClick}
              >
                {locale === "en" ? "Arabic" : "إنجليزي"}
              </Button>
            </div>
            {/* ===== TRASNSILATION CONTAINER ===== */}
          </div>
          {/* ===== CONTENT CONTAINER ===== */}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
