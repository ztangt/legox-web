
import MessageList from '../../../componments/messageList';
export default function IndexPage({ location }) {
  return <MessageList category={'DAILY'} limit={10} />;
}
