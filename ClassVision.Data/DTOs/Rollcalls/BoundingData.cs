using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Rollcalls;

public class BoundingData
{
    [JsonPropertyName("x")]
    public int X { get; set; }
    [JsonPropertyName("y")]
    public int Y { get; set; }
    [JsonPropertyName("w")]
    public int W { get; set; }
    [JsonPropertyName("h")]
    public int H { get; set; }
}
