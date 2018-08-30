import React from 'react';
import TagCloud from 'react-tag-cloud';
import randomColor from 'randomcolor';
import PropTypes from 'prop-types';

const styles = {
  large: {
    fontSize: 50,
    fontWeight: 'bold',
  },
  small: {
    opacity: 0.7,
    fontSize: 16,
  },
};


const renderSynonyms = (synonymList) => {
  if (synonymList) {
    return synonymList.split(', ').map(synonym => (
      <div key={synonym} style={styles.small}>{synonym}</div>
    ));
  } return <div />;
};

const SynonymBox = props => (
  <TagCloud
    style={{
      flex: '1',
      fontFamily: 'sans-serif',
      fontSize: 30,
      color: () => randomColor({
        hue: '4682B4',
        luminosity: 'dark',
      }),
      padding: 5,
    }}
  >
    <div style={props.initials.length > 10 ? '' : styles.large}>{props.initials}</div>
    {props.initials === props.text ?
      <div /> :
      <div style={props.text.length > 25 ? styles.small : ''}>{props.text}</div>}
    {renderSynonyms(props.synonym)}
  </TagCloud>
);


SynonymBox.propTypes = {
  initials: PropTypes.string.isRequired,
  synonym: PropTypes.string,
  text: PropTypes.string.isRequired,
};


export default SynonymBox;
