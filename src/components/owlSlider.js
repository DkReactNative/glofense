import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

export function Owl({item, component, className, options = {}}) {
  console.log(component);
  return (
    <OwlCarousel
      items={item}
      className={className}
      dotsClass={'owl-dots'}
      dotClass={'owl-dot'}
      {...options}
    >
      {component}
    </OwlCarousel>
  );
}
export default Owl;
