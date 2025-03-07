using ClassVision.API.Interfaces.Hubs;
using ClassVision.Data;
using ClassVision.Data.DTOs.Rollcalls;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace ClassVision.API.Hubs;

public class RollcallHub(AppDBContext dbContext) : Hub<IRollcallHubClient>
{

    private readonly AppDBContext dbContext = dbContext;

    public static Dictionary<string, List<ImageFaceDto>> RollcallData = [];

    public override async Task OnConnectedAsync()
    {

        //var doHaveConnection = ConnectedUser.TryGetValue(id, out var value);

        //if (doHaveConnection)
        //{
        //    value.Add(Context.ConnectionId);
        //}
        //else
        //{
        //    ConnectedUser.Add(id, [Context.ConnectionId]);
        //}

        //var rooms = dbContext.Rooms.Where(r => r.Users.Any(u => u.Id == id)).ToList();
        //var task = rooms.Select(room => Groups.AddToGroupAsync(Context.ConnectionId, room.Id.ToString()));
        //await Task.WhenAll(task);

        //Debug.WriteLine("Send other init");
        //await Clients.Others.SendAsync("InitRecieve", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        //var user = Context.User;
        //var id = user.Claims.GetClaimByUserId().Value;

        //ConnectedUser.TryGetValue(id, out var value);
        //value.Remove(Context.ConnectionId);

        await base.OnDisconnectedAsync(exception);
    }
}