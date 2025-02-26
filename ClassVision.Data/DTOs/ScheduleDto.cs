using ClassVision.Data.Entities;

namespace ClassVision.Data.DTOs;

public class ScheduleModifyDto
{
    public string Id { get; set; } = null!;

    public string CourseId { get; set; } = null!;

    public DateOnly Date { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

}