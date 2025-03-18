using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ClassVision.Data.DTOs.Rollcalls;

public class AIFaceResult
{
    [JsonPropertyName("id_pending_face")]
    public string? IdPendingFace { get; set; }

    [JsonPropertyName("id_user")]
    public string? IdUser { get; set; }


    [JsonPropertyName("BBox")]
    public BoundingData BBox { get; set; } = null!;

    [JsonPropertyName("Score_detect")]
    public double ScoreDetect { get; set; }

    [JsonPropertyName("Score_recognition")]
    public double ScoreRecognition { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = null!;
}
