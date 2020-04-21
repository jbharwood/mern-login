import React from "react";
import Doc from "./Doc.js";

const Docs = props => {

  const renderDocs = () => {
    return props.docs.map(doc => {
      return <Doc doc={doc} editDocument={props.editDocument}
        deleteDocument={props.deleteDocument} />
    })
  }

  return (
    <article className="docs">
      {renderDocs()}
    </article>
  )
}
export default Docs
