import React, { useState } from "react"
import { Radio, Block, BlockTitle, List, ListItem } from "konsta/react"

const Vote = () => {
  const [groupValue, setGroupValue] = useState("Option 2")

  return (
    <>
      <Block strong inset className="space-y-4">
        <div className="form-control w-full max-w-full">
          <label className="label">
            <span className="label-text">Add Issue</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-full"
          />
          <input type="submit" value="Submit" className="btn mt-2" />
        </div>
      </Block>
      <BlockTitle>Voting</BlockTitle>
      <List strong inset>
        <ListItem
          label
          title="Option 1"
          media={
            <Radio
              component="div"
              value="Option 1"
              checked={groupValue === "Option 1"}
              onChange={() => setGroupValue("Option 1")}
            />
          }
        />
        <ListItem
          label
          title="Option 2"
          media={
            <Radio
              component="div"
              value="Option 2"
              checked={groupValue === "Option 2"}
              onChange={() => setGroupValue("Option 2")}
            />
          }
        />
        <ListItem
          label
          title="Option 3"
          media={
            <Radio
              component="div"
              value="Option 3"
              checked={groupValue === "Option 3"}
              onChange={() => setGroupValue("Option 3")}
            />
          }
        />
      </List>
    </>
  )
}

export default Vote
