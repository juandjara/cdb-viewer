import React from 'react'
import styled from 'styled-components'

const AlertStyles = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 24px;
  z-index: 2;

  max-width: 600px;
  margin: 0 auto;
  padding: 12px 1rem;
  border-radius: 8px;
  margin-bottom: 12px;
  will-change: transform;
  animation: 0.5s slideIn;
  font-weight: 500;
  background-color: #ffdddd;
  box-shadow: 2px 2px 4px -2px #800000;
  white-space: pre-line;

  p {
    margin: 0;
  }

  > p::first-letter {
    text-transform: capitalize;
  }
  
  button {
    appearance: none;
    background-color: transparent;
    border: none;
    position: absolute;
    top: 0;
    right: 0;
    padding: 3px;
    height: 20px;
    cursor: pointer;

    &:hover, &:focus {
      background-color: rgba(255,255,255, 0.25);
    }
  }
`

function IconClose (props) {
  return (
    <svg 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      width="24" height="24"
      viewBox="0 0 24 24"
      {...props}>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  )
}

export default function Alert ({ text, onClose }) {
  return (
    <AlertStyles>
      <p>{text}</p>
      <button onClick={onClose}>
        <IconClose width="14" height="14" />
      </button>
    </AlertStyles>
  )
}
