import React from 'react'
import styled from 'styled-components'

const LoadingStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 30px;
    height: 30px;
    animation: rotate 2s linear forwards running infinite;

    path {
      fill: none;
      stroke: black;
      stroke-width: 20;
      stroke-dasharray: 629;
      animation: load 2s linear forwards running infinite;
    }
  }

  @keyframes load {
    0% {
      stroke-dashoffset: 0;
      opacity: 1;
    }

    100% {
      stroke-dashoffset: 1260;
      opacity: 1;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotateZ(-90deg);
    }

    100% {
      transform: rotateZ(270deg);;
    }
  }
`

export default function Loading ({ size, color }) {
  return (
    <LoadingStyles className="loading">
      <svg viewBox="-10 -10 220 220" style={{ width: size, height: size }}>
        <path style={{'stroke': color}} d="M200,100 C200,44.771525 155.228475,0 100,0 C44.771525,0 0,44.771525 0,100 C0,155.228475 44.771525,200 100,200 C155.228475,200 200,155.228475 200,100 Z" strokeDashoffset="0"></path>
      </svg>
    </LoadingStyles>
  )
}
