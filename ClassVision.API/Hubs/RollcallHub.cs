using ClassVision.API.Interfaces.Hubs;
using ClassVision.Data;
using ClassVision.Data.DTOs.Rollcalls;
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

namespace ClassVision.API.Hubs;

public class RollcallHub(AppDBContext dbContext) : Hub<IRollcallHubClient>
{

    private readonly AppDBContext dbContext = dbContext;

    public static ConcurrentDictionary<string, ConcurrentDictionary<string, ImageFaceDto>> RollcallData = [];

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



    public async Task JoinPath(string pathUrl)
    {
        var images = await dbContext.Schedules.Where(s => s.Id.ToString() == pathUrl)
            .Select(s => s.Images).SingleAsync();

        foreach (var image in images)
        {
            var value = RollcallData.GetOrAdd(image.Path, []);
            await Groups.AddToGroupAsync(Context.ConnectionId, image.Path);

            await Clients.Caller.ReceiveMessage(new(image.Path, value));
        }

        var fixedData = RollcallData.GetOrAdd("/api/Media/lop6.jpg", []);
        await Groups.AddToGroupAsync(Context.ConnectionId, "/api/Media/lop6.jpg");
        await Clients.Caller.ReceiveMessage(new("/api/Media/lop6.jpg", fixedData));


    }

    public async Task UpdateData(string path, string id, string dto)
    {

        var faceValue = JsonSerializer.Deserialize<ImageFaceDto>(dto);
        var value = RollcallData.GetOrAdd(path, []);
        value.AddOrUpdate(id, faceValue, (key, oldValue) => faceValue);
        await Clients.Group(path).ReceiveMessage(new(path, value));
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