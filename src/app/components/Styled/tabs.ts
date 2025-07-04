import styled from "styled-components/macro";

interface ITab {
  active?: boolean;
  position?: string;
}

const translateX0 = "translateX(0%)";
export const Tab = {
  Container: styled.div`
    display: flex;
    justify-content: flex-start;
    color: #000000;
    border-radius: 10px;
    width: 531px;
    height: 41px;
    cursor: pointer;
    position: relative;
    background-color: #f1f3f5;
  `,
  Left: styled.div<ITab>`
    text-align: center;
    position: relative;
    color: ${(props) => (props.active ? "#6061E5" : "#231D2C")};
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
    font-size: 18px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    ::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 41px;
      background: ${(props) => (props.active ? "#6061E5" : "transparent")};
      transform: ${(props) =>
        // eslint-disable-next-line sonarjs/no-duplicate-string
        props.active ? translateX0 : "translateX(-100%)"};
      transition: transform 0.3s linear;
    }
  `,
  Center: styled.div<ITab>`
    text-align: center;
    position: relative;
    color: ${(props) => (props.active ? "#FFF" : "#231D2C")};
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
    font-size: 18px;
    border-right: 1px solid #adb5bd;
    border-left: 1px solid #adb5bd;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    ::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 41px;
      background: ${(props) => (props.active ? "#6061E5" : "transparent")};
      transform: ${(props) =>
        props.active ? translateX0 : "translateX(-100%)"};
      transition: transform 0.3s linear;
    }
  `,

  Right: styled.div<ITab>`
    text-align: center;
    position: relative;
    color: ${(props) => (props.active ? "#fff" : "#231D2C")};
    font-weight: ${(props) => (props.active ? "700" : "normal")};
    font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
    font-size: 18px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    ::after {
      content: "Story";
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 41px;
      color: #fff;
      background: ${(props) => (props.active ? "#6061E5" : "transparent")};
      transform: ${(props) =>
        props.active ? translateX0 : "translateX(-100%)"};
      transition: transform 0.3s linear;
    }
  `,
};
