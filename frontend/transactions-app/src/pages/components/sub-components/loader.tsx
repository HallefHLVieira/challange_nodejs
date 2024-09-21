const Loader = () => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 100"
    width="35px"
    height="35px"
  >
    <circle
      fill="none"
      stroke="#64D7C7"
      strokeWidth="8"
      strokeMiterlimit="10"
      cx="50"
      cy="50"
      r="40"
      strokeDasharray="62.83185307179586 62.83185307179586"
      transform="rotate(34.817 50 50)"
    >
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default Loader;
