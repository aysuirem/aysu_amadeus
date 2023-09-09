import React, { Component } from 'react';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import cities from './flight.json';
import { useCombobox } from 'downshift';
import logo from './assets/amadeuslogo.png';
import durations from './durations.json';
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
    this.setState((prevState) => ({
      yon: prevState.yon === 'gidisDonus' ? 'tekYon' : 'gidisDonus',
    }));
  };
  handleAraClick = () => {
    const { nereden, nereye, yon, tekYonTarih, gidisDonusTarihler } = this.state;
    const selectedDate = yon === 'tekYon' ? tekYonTarih : gidisDonusTarihler.gidis;
    const matchingFlights = durations.durations.filter((flight) => {
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
          (flight.kalkisZamani.startsWith(gidisDonusTarihler.gidis)
          && flight.varisZamani.startsWith(gidisDonusTarihler.donus))
        );
      }

    });
    document.querySelector('.dropdown').style.display = 'block';
    if (matchingFlights.length > 0) {
      this.setState({
        uygunUcuslar: matchingFlights,
      });
    } else {
      console.log("Uygun uçuş bulunamadı.");
    }

  };


  handleSortChange = (event) => {
    const sortBy = event.target.value;
    const { uygunUcuslar } = this.state;

    const sortedFlights = uygunUcuslar.slice().sort((a, b) => {
      if (sortBy === 'kalkisZamani') {
        return new Date(a.kalkisTarihi) - new Date(b.kalkisTarihi);
      } else if (sortBy === 'ucusSuresi') {
        return a.ucusSuresi - b.ucusSuresi;
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


          <div className='combobox'> <NeredenOtomatikTamamlama
            onSelectionChange={(selection) => this.setState({ nereden: selection })}
            options={this.neredenSecenekler}
            placeholder="Nereden"
          /></div>
          <div className='combobox'>
            <NereyeOtomatikTamamlama
              onSelectionChange={(selection) => this.setState({ nereye: selection })}
              options={this.nereyeSecenekler}
              placeholder="Nereye"
            />
          </div>

          {this.state.yon === 'tekYon' ? (

            <input className='datepicker_header'
              type="date"
              value={this.state.tekYonTarih || ''}
              onChange={this.handleTekYonDateChange}

            />

          ) : (

            <><input
              type="date"
              className='datepicker_header'
              value={this.state.gidisDonusTarihler.gidis || ''}
              onChange={this.handleGidisDateChange} /><input
                type="date"
                className='datepicker_header'
                value={this.state.gidisDonusTarihler.donus || ''}
                onChange={this.handleDonusDateChange} /></>

          )}


          <button className='search' onClick={this.handleAraClick}>Ara</button>

        </div>
        <select onChange={this.handleSortChange} className='dropdown'>
          <option value="">Sırala</option>
          <option value="kalkisZamani">Kalkış Saati</option>
          <option value="ucusUzunlugu">Uçuş Uzunluğu</option>
          <option value="fiyat">Fiyat</option>
        </select>

        <div className='flight-results'>
          {this.state.uygunUcuslar.map((ucus, index) => (
            <div key={index} className="flight-box">
              <div className="flight-info">
                <div className='nnnn'>
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
                  <p>{ucus.kalkisTarihi}</p>
                </div>
                  </div>
                </div>
               

                <p>Süre: {ucus.ucusSuresi}</p>
              </div>
              <div className="flight-price">
                <p>Fiyat: {ucus.fiyat} TL</p>
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
    //BURADA SIKINTI VAR
  });

  return (
    <div>
      <input
        className='button'
        {...getInputProps({
          placeholder: placeholder,
        })}
      />
      <div {...getMenuProps()} >
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
