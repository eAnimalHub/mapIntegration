import React, {useState} from 'react';
const {View, StatusBar} = require('react-native');
import Routes from './src/Navigation/Routes';
import Toast from 'react-native-toast-message';
import colors from './src/colors';
export const Context = React.createContext();

const App = () => {
  const [userList, setUserList] = useState([]);

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Toast style={{height: 60, width: '100%', backgroundColor: 'black'}} />
      <Context.Provider value={{userList: userList, setUserList: setUserList}}>
        <Routes />
      </Context.Provider>
      <Toast />
    </View>
  );
};

export default App;
