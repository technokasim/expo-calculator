import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import Button from './src/components/Button';
import Display from './src/components/Display';

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

let variableA;
let variableB;
let result;

export default class App extends Component {

 
  bannerError = () => {
    console.log('banner ad not loading')
  }
bannerAdReceived = () => {
    console.log('banner ad received')
  }
showInterstitial = async () => {
    AdMobInterstitial.setAdUnitID('ca-app-pub-2939927879380433/2812445142'); // Test ID, Replace with your-admob-unit-id
    
    try{
      await AdMobInterstitial.requestAdAsync();
      await AdMobInterstitial.showAdAsync();
    }
    catch(e){
      console.log(e);
    }
}

  state = {
    modalVisible: false,
    display: 0,
    operation: '',
    shouldConcatenateDigit: false,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  concatenateDigit = (digit) => {
    if (this.state.shouldConcatenateDigit) {
      this.setState((prevState) => ({
        display: prevState.display + digit,
      }));
    } else {
      this.setState({
        display: digit,
        shouldConcatenateDigit: true,
      });
    }
  };

  activateOperation = (operation) => {
    variableA = Number(this.state.display);
    this.setState({
      shouldConcatenateDigit: false,
      operation,
    });
  };

  generateResult = () => {
    switch (this.state.operation) {
      case 'division':
        variableB = Number(this.state.display);
        result = variableA / variableB;
        this.setState({
          display: +result.toFixed(5),
          operation: '',
        });
        break;
      case 'multiplication':
        variableB = Number(this.state.display);
        result = variableA * variableB;
        this.setState({
          display: +result.toFixed(5),
          operation: '',
        });
        break;
      case 'subtraction':
        variableB = Number(this.state.display);
        result = variableA - variableB;
        this.setState({
          display: +result.toFixed(5),
          // This tweak fixes erros like 0.3 - 0.2 !== 0.1
          operation: '',
        });
        break;
      case 'addition':
        variableB = Number(this.state.display);
        result = variableA + variableB;
        this.setState({
          display: +result.toFixed(5),
          // This tweak fixes errors like 0.1 + 0.2 !== 0.3
          operation: '',
        });
        break;
      default:
        return null;
    }
  };

  cancelButton = () => {
    if (!this.state.shouldConcatenateDigit && this.state.display === 0) {
      this.setState({
        operation: '',
      });
    }
    this.setState({
      display: 0,
      shouldConcatenateDigit: false,
    });
  };

  addDot = () => {
    if (Math.round(this.state.display) === Number(this.state.display)) {
      this.setState((prevState) => ({
        display: `${prevState.display}.`,
        shouldConcatenateDigit: true,
      }));
    }
  };

  percentage = () => {
    this.setState((prevState) => ({
      display: prevState.display / 100,
    }));
  }

  invertSignal = () => {
    this.setState((prevState) => ({
      display: prevState.display * -1,
    }));
  }

  render() {
    return (
      <View style={styles.container}>

        
             <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 22, marginLeft: '70%'}}>
            
              <Button
              style={{marginLeft:250}}
              backgroundColor="#333333"
              color="white"
              text="X"
              function={() => this.setModalVisible(false)}
              />
             

              
            </View>


          <View style={{padding:25}}>
                      <Text style={{fontSize: 40, fontWeight: 'bold'}}>Thank you for using Calculator Greater</Text>

                      <AdMobBanner
                        bannerSize="fullBanner"
                        adUnitID="ca-app-pub-2939927879380433/2328217653" // Test ID, Replace with your-admob-unit-id
                        servePersonalizedAds // true or false
                        onDidFailToReceiveAdWithError={this.bannerError} />

          </View>
        </Modal>

        <Display display={this.state.display} />
        <View style={styles.row}>
          <Button
            backgroundColor="#A6A6A6"
            color="black"
            text={this.state.display ? 'C' : 'AC'}
            function={() => this.cancelButton()}
          />
          <Button
            backgroundColor="#A6A6A6"
            color="black"
            text="+/-"
            function={() => this.invertSignal()}
          />
          <Button
            backgroundColor="#A6A6A6"
            color="black"
            text="%"
            function={() => this.percentage()}
          />
          <Button
            orange
            backgroundColor={
              this.state.operation === 'division' ? 'white' : '#FF9404'
            }
            color={this.state.operation === 'division' ? '#FF9404' : 'white'}
            text="÷"
            function={() => this.activateOperation('division')}
          />
        </View>
        <View style={styles.row}>
          <Button
            backgroundColor="#333333"
            color="white"
            text="7"
            function={() => this.concatenateDigit('7')}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="8"
            function={() => this.concatenateDigit('8')}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="9"
            function={() => this.concatenateDigit('9')}
          />
          <Button
            orange
            backgroundColor={
              this.state.operation === 'multiplication' ? 'white' : '#FF9404'
            }
            function={() => this.activateOperation('multiplication')}
          >
            <Feather
              name="x"
              size={25}
              color={
                this.state.operation === 'multiplication' ? '#FF9404' : 'white'
              }
              style={styles.icon}
            />
          </Button>
        </View>
        <View style={styles.row}>
          <Button
            backgroundColor="#333333"
            color="white"
            text="4"
            function={() => this.concatenateDigit('4')}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="5"
            function={() => this.concatenateDigit('5')}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="6"
            function={() => this.concatenateDigit('6')}
          />
          <Button
            orange
            backgroundColor={
              this.state.operation === 'subtraction' ? 'white' : '#FF9404'
            }
            function={() => this.activateOperation('subtraction')}
          >
            <Feather
              name="minus"
              size={25}
              color={
                this.state.operation === 'subtraction' ? '#FF9404' : 'white'
              }
              style={styles.icon}
            />
          </Button>
        </View>
        <View style={styles.row}>
          <Button
            backgroundColor="#333333"
            color="white"
            text="1"
            function={() => this.concatenateDigit('1')}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="2"
            function={() => this.concatenateDigit('2')}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="3"
            function={() => this.concatenateDigit('3')}
          />
          <Button
            orange
            backgroundColor={
              this.state.operation === 'addition' ? 'white' : '#FF9404'
            }
            function={() => this.activateOperation('addition')}
          >
            <Feather
              name="plus"
              size={25}
              color={this.state.operation === 'addition' ? '#FF9404' : 'white'}
              style={styles.icon}
            />
          </Button>
        </View>
        <View style={styles.row}>
          <Button
         
            backgroundColor="#333333"
            color="white"
            text="✺"
            function={() => this.setModalVisible(true)}
          />
          <Button
           
            backgroundColor="#333333"
            color="white"
            text="0"
            function={() => this.concatenateDigit('0')}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="."
            function={() => this.addDot()}
          />
          <Button
            orange
            backgroundColor="#FF9404"
            color="white"
            text="="
            function={() => this.generateResult()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'black',
    padding: 8,
    paddingBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 7,
  },
  icon: {
    textAlign: 'center',
  },
  right:{
    textAlign: 'right',
  },
});
