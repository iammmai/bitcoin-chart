
import styled from 'styled-components'

const Tooltip = styled.div`
  color: #878787;
  font-size: 1em;
  padding: 10px;
  position: absolute;
  background-color: #27273f;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  border: 1px solid rgba(25, 29, 34, 0.12);
  transition: opacity 0.5s ease-in-out;
`
export default Tooltip