import React from "react";
import Docs from "./Docs.js";

const User = (props) => {

  const renderDocs = () => {
    return <Docs docs={props.user.docs} editDocument={props.editDocument}
      deleteDocument={props.deleteDocument}/>
  }

  return (
    <section className="">
      <section className="margin">
      <h3 align="center">{props.user.username}</h3>
        {renderDocs()}
      </section>
    </section>
  )
}
export default User
