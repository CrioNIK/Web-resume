using UnityEngine;

// Рухає об'єкт між двома точками з паузою на розвороті.
[DisallowMultipleComponent]
public class Patrol : MonoBehaviour
{
    [SerializeField] private Vector3 offset = new Vector3(4f, 0f, 0f);
    [SerializeField, Min(0f)] private float speed = 2f;
    [SerializeField, Min(0f)] private float pauseDuration = 0.25f;

    private Vector3 startPosition;
    private Vector3 endPosition;
    private bool movingToEnd = true;
    private bool initialized;
    private float pauseRemaining;

    private void Start()
    {
        startPosition = transform.position;
        endPosition = startPosition + offset;
        initialized = true;
    }

    private void Update()
    {
        float deltaTime = Time.deltaTime;

        if (deltaTime <= 0f || speed <= 0f || startPosition == endPosition)
            return;

        if (pauseRemaining > 0f)
        {
            float waitTime = Mathf.Min(pauseRemaining, deltaTime);
            pauseRemaining -= waitTime;
            deltaTime -= waitTime;

            if (deltaTime <= 0f)
                return;
        }

        Vector3 target = movingToEnd ? endPosition : startPosition;
        transform.position = Vector3.MoveTowards(
            transform.position, target, speed * deltaTime);

        if (transform.position == target)
        {
            transform.position = target;
            movingToEnd = !movingToEnd;
            pauseRemaining = pauseDuration;
        }
    }

    private void OnDrawGizmosSelected()
    {
        bool running = Application.isPlaying && initialized;
        Vector3 start = running ? startPosition : transform.position;
        Vector3 end = running ? endPosition : start + offset;

        Gizmos.DrawLine(start, end);
        Gizmos.DrawWireSphere(start, 0.12f);
        Gizmos.DrawWireSphere(end, 0.12f);
    }
}
