using ClassVision.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Rollcalls;

public class ImageFaceDto
{
    //id: string | number,
    //user_id?: string,
    //status: EFaceStatus,
    //data: {
    //    x: number | string,
    //    y: number | string,
    //    w: number | string,
    //    h: number | string,
    //}
    [JsonPropertyName("id")]
    public string Id { get; set; } = null!;

    [JsonPropertyName("user_id")]
    public string? UserId { get; set; }

    [JsonPropertyName("status")]
    public EFaceStatus Status { get; set; }

}
