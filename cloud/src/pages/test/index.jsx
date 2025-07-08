import React from "react";
import 'react-reflex/styles.css';
import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex'
export default function SimpleVertical() {
  return (
    <ReflexContainer orientation="vertical">

    <ReflexElement className="left-pane"
      threshold={40}
      >
      <div className="pane-content">
        <label>
          Left Pane (resizable)
        </label>
      </div>
    </ReflexElement>

    <ReflexSplitter propagate={true}/>

    <ReflexElement className="middle-pane">
      <div className="pane-content">
        <label>
          Middle Pane (resizable)
          <br/>
          <br/>
          minSize = 200px
          <br/>
          maxSize = 800px
        </label>
      </div>
    </ReflexElement>

    <ReflexSplitter propagate={true}/>

    <ReflexElement className="right-pane">
      <div className="pane-content">
        <label>
          Right Pane (resizable)
          Right Pane (resizable)
          Right Pane (resizable)
          Right Pane (resizable)
        </label>
      </div>
    </ReflexElement>

    </ReflexContainer>
  );
}
