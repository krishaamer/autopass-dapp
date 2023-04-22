import { Block, BlockTitle, List, ListItem } from "konsta/react"

const Vote = () => {
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
      <BlockTitle>Votes</BlockTitle>
      <List strong inset>
        <ListItem title="Vote 1" />
        <ListItem title="Vote 2" />
        <ListItem title="Vote 3" />
        <ListItem title="Vote 4" />
        <ListItem title="Vote 5" />
      </List>
    </>
  )
}

export default Vote
