import React, { Component } from 'react';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import cities from './flight.json';
import { useCombobox } from 'downshift';
import logo from './assets/amadeuslogo.png';
import logoAr from './assets/arrivals.png';
import logoDep from './assets/departure.png'



class AnaSayfa extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            yon: 'tekYon',
            tekYonTarih: null,
            gidisDonusTarihler: {
                gidis: null,
                donus: null,
                isLoading: false,

            },
            nereden: '',
            nereye: '',
            uygunUcuslar: [],

        };

        this.neredenSecenekler = cities.cities.map((city) => city.adi);
        this.nereyeSecenekler = cities.cities.map((city) => city.adi);
    }

    handleRadioChange = (event) => {
        this.setState({ yon: event.target.value });
    }
    handleTekYonClick = () => {
        this.setState({ yon: 'tekYon' });
    }

    handleGidisDonusClick = () => {
        this.setState({ yon: 'gidisDonus' });
    }
    handleTekYonDateChange = (event) => {
        this.setState({ tekYonTarih: event.target.value });
    }

    handleGidisDateChange = (event) => {
        this.setState((prevState) => ({
            gidisDonusTarihler: {
                ...prevState.gidisDonusTarihler,
                gidis: event.target.value,
            },
        }));
    }

    handleDonusDateChange = (event) => {
        this.setState((prevState) => ({
            gidisDonusTarihler: {
                ...prevState.gidisDonusTarihler,
                donus: event.target.value,
            },
        }));
    }

    handleNeredenChange = (event) => {
        this.setState({ nereden: event.target.value });
        
    }

    handleNereyeChange = (event) => {
        this.setState({ nereye: event.target.value });
    }
    handleSwitchChange = () => {
        document.querySelector('.dropdown').style.display = 'none';

        this.setState({
          yon: this.state.yon === 'gidisDonus' ? 'tekYon' : 'gidisDonus',
          uygunUcuslar: [], 
        });
      };
      

      handleAraClick = () => {
        const { nereden, nereye, yon, tekYonTarih, gidisDonusTarihler } = this.state;
      
        if (!nereden || !nereye || (!tekYonTarih && (!gidisDonusTarihler.gidis || !gidisDonusTarihler.donus))) {
          alert("Uçuş bilgilerini doldurmalısınız.");
          return;
        }
      
        this.setState({ isLoading: true });
      
        const apiUrl = 'http://localhost:3000/durations'; //README dosyasına bakabilirsiniz.
        fetch(apiUrl)
          .then((response) => response.json())
          .then((data) => {
            const selectedDate = yon === 'tekYon' ? tekYonTarih : gidisDonusTarihler.gidis;
            const matchingFlights = data.filter((flight) => {
              if (yon === 'tekYon') {
                return (
                  flight.kalkisHavalimani === nereden &&
                  flight.varisHavalimani === nereye &&
                  flight.kalkisZamani.startsWith(selectedDate)
                );
              } else {
                return (
                  flight.kalkisHavalimani === nereden &&
                  flight.varisHavalimani === nereye &&
                  (flight.kalkisZamani.startsWith(gidisDonusTarihler.gidis) &&
                    flight.varisZamani.startsWith(gidisDonusTarihler.donus))
                );
              }
            });
      
            if (matchingFlights.length > 0) {
              document.querySelector('.dropdown').style.display = 'block';
      
              this.setState({
                uygunUcuslar: matchingFlights,
                isLoading: false,
              });
            } else {
              console.log("Uygun uçuş bulunamadı.");
              if (nereden || nereye || (tekYonTarih && (gidisDonusTarihler.gidis && gidisDonusTarihler.donus))) {
                alert("Uygun uçuş bulunamadı.");
                
              }
              this.setState({ isLoading: false }); 
            }
          })
          .catch((error) => {
            console.error('API isteği sırasında hata oluştu: ', error);
            this.setState({ isLoading: false });   
          });
      };
      
      

      convertSureToMinutes(sure) {
        const parts = sure.split(' ');
        let totalMinutes = 0;
    
        for (let i = 0; i < parts.length; i += 2) {
            if (parts[i + 1] === 's') {
                totalMinutes += parseInt(parts[i]) * 60;
            } else if (parts[i + 1] === 'dk') {
                totalMinutes += parseInt(parts[i]);
            }
        }
    
        return totalMinutes;
    }
    

    handleSortChange = (event) => {
        const sortBy = event.target.value;
        const { uygunUcuslar } = this.state;

        const sortedFlights = uygunUcuslar.slice().sort((a, b) => {
            if (sortBy === 'kalkisZamani') {
                const kalkisSaatiA = a.kalkisZamani.split('T')[1].split(':')[0];
                const kalkisDakikaA = a.kalkisZamani.split('T')[1].split(':')[1];
                const kalkisSaatiB = b.kalkisZamani.split('T')[1].split(':')[0];
                const kalkisDakikaB = b.kalkisZamani.split('T')[1].split(':')[1];

                if (kalkisSaatiA !== kalkisSaatiB) {
                    return parseInt(kalkisSaatiA) - parseInt(kalkisSaatiB);
                } else {
                    return parseInt(kalkisDakikaA) - parseInt(kalkisDakikaB);
                }
            } else if (sortBy === 'ucusSuresi') {
                const sureA = this.convertSureToMinutes(a.ucusSuresi);
                const sureB = this.convertSureToMinutes(b.ucusSuresi);

                return sureA - sureB;
            } else if (sortBy === 'fiyat') {
                return a.fiyat - b.fiyat;
            }
            return 0;
        });

        this.setState({ uygunUcuslar: sortedFlights });
    };



    render() {
        return (
            <div>
                <div className='header-bg'>
                    <img src={logo} alt='logo'></img>
                    <p>TRAVEL TO FUTURE</p>

                </div>


                <div>
                    <div className='switch-container'>
                        <label class="switch">
                            <input type="checkbox" id="switch" checked={this.state.yon === 'gidisDonus'} onChange={this.handleSwitchChange} />
                            <span class="slider"></span>

                        </label>
                    </div>
                </div>

                <div className='row'>

                <div className='combobox'>
  <NeredenOtomatikTamamlama
    onSelectionChange={(selection) => this.setState({ nereden: selection })}
    options={this.neredenSecenekler}
    placeholder="Nereden"
    
  />
</div>
<div className='combobox'>
  <NereyeOtomatikTamamlama
    onSelectionChange={(selection) => this.setState({ nereye: selection })}
    options={this.nereyeSecenekler}
    placeholder="Nereye"
  />
</div>
{this.state.yon === 'tekYon' ? (
  <input
    className='datepicker_header'
    type="date"
    defaultValue={this.state.tekYonTarih || ''}
    onChange={this.handleTekYonDateChange}
  />
) : (
  <>
    <input
      type="date"
      className='datepicker_header'
      defaultValue={this.state.gidisDonusTarihler.gidis || ''}
      onChange={this.handleGidisDateChange}
    />
    <input
      type="date"
      className='datepicker_header'
      defaultValue={this.state.gidisDonusTarihler.donus || ''}
      onChange={this.handleDonusDateChange}
    />
  </>
)}



                    <button className='search' onClick={this.handleAraClick}>Ara</button>
                    {this.state.isLoading && <div className="loading"><div className="spinner"></div></div>}

                </div>
                <select onChange={this.handleSortChange} className='dropdown'>
                    <option value="">Sırala</option>
                    <option value="kalkisZamani">Kalkış Saati</option>
                    <option value="ucusSuresi">Uçuş Uzunluğu</option>
                    <option value="fiyat">Fiyat</option>
                </select>

                <div className='flight-results'>
                    {this.state.uygunUcuslar.map((ucus, index) => (

                        <div key={index} className="flight-box">
                            <div className="flight-info">
                                <div>
                                    <div className="flight-details">
                                        <div className="flight-details-left">
                                            <img className='flight-icon' src={logoDep} alt="Kalkış Icon" />
                                            <p>{ucus.kalkisHavalimani}</p>
                                        </div>
                                        <div> - {ucus.varisHavalimani} - </div>
                                        <div className="flight-details-right">
                                            <img className='flight-icon' src={logoAr} alt="Varış Icon" />
                                        </div>
                                        <div className="kalkis-zamani">
                                            <p>{new Date(ucus.kalkisZamani).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                </div>


                                <p>Süre: {ucus.ucusSuresi}</p>
                            </div>
                            <div className="flight-price">
                                <p>{ucus.fiyat} TL</p>
                            </div>
                        </div>


                    ))}
                </div>
            </div>

        );
    }
}
function OtomatikTamamlama({ onSelectionChange, options, placeholder }) {
    const {
        isOpen,
        getMenuProps,
        getInputProps,
        getItemProps,
        inputValue,
        highlightedIndex,
    } = useCombobox({
        items: options,
        onInputValueChange: ({ inputValue }) => {
        },
        onSelectedItemChange: ({ selectedItem }) => {
            onSelectionChange(selectedItem || "");
        },
        itemToString: (item) => (item ? item : ''),
        filterItems: (items, value) =>
        items.filter(
            (item) => item.toLowerCase().includes(value.toLowerCase())
        ),
    

    });

    return (
        <div>
            <input
                className='button'
                {...getInputProps({
                    placeholder: placeholder,
                })}
            />
            <div {...getMenuProps()} className="item-container" >
                {isOpen
                    ? options
                        .filter((item) => !inputValue || item.includes(inputValue))
                        .map((item, index) => (
                            <div
                                {...getItemProps({
                                    key: item,
                                    index,
                                    item,
                                })}
                                className={`item ${highlightedIndex === index ? 'item-highlighted' : ''
                              
                                    }`}
                            >
                                {item}
                              
                            </div>
                            
                        ))
                    : null}
            </div>
        </div>
    );
}

function NeredenOtomatikTamamlama(props) {
    return <OtomatikTamamlama {...props} />;
}

function NereyeOtomatikTamamlama(props) {
    return <OtomatikTamamlama {...props} />;
}

export default AnaSayfa;
