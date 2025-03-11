using ClassVision.Data.DTOs.Rollcalls;

namespace ClassVision.API.Interfaces.Hubs;

public record RollcallImageDto(string Path, IDictionary<string, ImageFaceDto> ImageFaces);

public interface IRollcallHubClient
{
    Task ReceiveMessage(RollcallImageDto dto);
}
