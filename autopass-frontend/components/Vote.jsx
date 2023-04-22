import React, { useState } from "react"
import { Page, Navbar, Link, Radio, Block, BlockTitle, List, ListItem, Popup } from "konsta/react"

const Vote = () => {
  const [groupValue, setGroupValue] = useState("Option 2")
  const [popupOpened, setPopupOpened] = useState(false)

  return (
    <>
      <Block strong inset className="space-y-4">
        <div className="form-control w-full max-w-full">
          <label className="label">
            <span className="label-text">Add Issue</span>
          </label>
          <input
            type="text"
            placeholder="Type here..."
            className="input input-bordered w-full max-w-full"
          />
          <input type="submit" value="Submit New Issue" className="btn mt-2" />
        </div>
      </Block>
      <BlockTitle>Active Issues</BlockTitle>
      <List strong inset>
        <ListItem
          title="Issue 1"
          link
          header="This is an issue about a topic"
          onClick={() => setPopupOpened(true)}
        />
        <ListItem
          title="Issue 2"
          link
          header="This is an issue about a topic"
          onClick={() => setPopupOpened(true)}
        />
        <ListItem
          title="Issue 3"
          link
          header="This is an issue about a topic"
          onClick={() => setPopupOpened(true)}
        />
      </List>
      <Popup opened={popupOpened} onBackdropClick={() => setPopupOpened(false)}>
        <Page>
          <Navbar
            title="Vote"
            right={
              <Link navbar onClick={() => setPopupOpened(false)}>
                Close
              </Link>
            }
          />
          <Block className="space-y-4">
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
                    onClick={() => setPopupOpened(false)}
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
                    onClick={() => setPopupOpened(false)}
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
                    onClick={() => setPopupOpened(false)}
                  />
                }
              />
            </List>
          </Block>
        </Page>
      </Popup>
    </>
  )
}

export default Vote
