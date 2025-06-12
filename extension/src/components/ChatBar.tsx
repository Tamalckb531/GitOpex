const ChatBar = () => {
  return (
    <form>
      <div className="flex items-center p-2 rounded-lg bg-[var(--bg-color)]">
        <textarea
          id="chat"
          rows={1}
          className="block mx-2 p-2.5 w-full text-sm text-gray-900 bg-[var(--bg-color)] rounded-lg border border-[var(--dark-color)] outline-none"
          placeholder="Your message..."
        ></textarea>
        <button
          type="submit"
          className="inline-flex justify-center p-2.5 text-[var(--bg-color)] rounded-sm text-sm cursor-pointer bg-[var(--dark-color)] hover:bg-[#716863]"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatBar;
