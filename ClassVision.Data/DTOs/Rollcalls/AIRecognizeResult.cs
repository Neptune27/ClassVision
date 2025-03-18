using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Rollcalls;

public class AIRecognizeResult
{
    [JsonPropertyName("user_list")]
    public List<string> UserList { get; set; } = [];

    [JsonPropertyName("faces")]
    public List<AIFaceResult> Faces { get; set; } = [];

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}
