export const openScreen = (navigation, screenName, props) => {
  navigation.navigate(screenName, props); // will push this component only once
};
