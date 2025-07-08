import React from 'react';
import AddressList from './componments/addressList';
import { useOutletContext } from 'umi'

export default ({location}) => {
  return (
      <AddressList location={location|| useOutletContext()?.location}></AddressList>
  );
};
