using ChatClientApp.Models;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace ChatClientApp.Hubs
{
    public class ChatHub : Hub
    {
        #region Fields
        private string _groupName;
        private Dictionary<string, string> _activeUsers = new Dictionary<string, string>();
        #endregion

        public ChatHub()
        {
            this._groupName = "Chat";
            
        }
        private readonly List<User> _users = new List<User>();



        public async Task JoinGroup(string userName)
        {
            //add user to the group
            await Groups.AddToGroupAsync(Context.ConnectionId, this._groupName);
            //add user to the list of active users
            _activeUsers.Add(Context.ConnectionId, userName);

            //send message to the UI about the changes in the group
            await Clients.Group(this._groupName).SendAsync("UserJoinedGroup", userName, Context.ConnectionId);

        }

        public async Task ExitGroup()
        {
            //remove user from the group
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, _groupName);
            _activeUsers.Remove(Context.ConnectionId);

            //send message to the UI about the changes in the group
            await Clients.Group(this._groupName).SendAsync("UserExitedGroup", Context.ConnectionId);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            _users.RemoveAll(x => x.ConnectionId == Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string username, string message)
        {
          
            //send the message to all subcribers of the group

            await Clients.Group(this._groupName).SendAsync("ReceiveMessage", message, Context.ConnectionId, username);
        }
        public Task GetConnectedUsers()
        {
            return Task.FromResult(_users);
        }
    }
}
