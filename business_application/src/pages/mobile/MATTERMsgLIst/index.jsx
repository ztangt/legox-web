
import MessageList from '../../../componments/messageList';
export default function IndexPage({ location }) {
  return <MessageList category={'MATTER'} limit={10} />;
}
