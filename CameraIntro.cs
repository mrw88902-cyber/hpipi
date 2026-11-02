using System.CollectionsCollections;
using UnityEngine;

public class CameraIntro : MonoBehaviour
{
    [Header("Word Targets")]
    public Transform[] wordTargets; // حط هنا الكلمات/الأهداف بالترتيب

    [Header("Camera Settings")]
    public float wordZoomSize = 2f;    // درجة التقريب على الكلمة (كل ما صغرت الرقم يقرب أكتر)
    public float defaultZoomSize = 5f; // درجة الزوم العادية للعبة
    public float moveSpeed = 2f;       // سرعة الانتقال بين الكلمات
    public float rotateSpeed = 90f;    // سرعة دوران الكاميرا وهي بتستعرض الكلمات
    public float waitAtWord = 0.5f;    // الوقت اللي بتقف فيه الكاميرا عند كل كلمة

    private Camera cam;

    void Start()
    {
        cam = GetComponent<Camera>();
        StartCoroutine(PlayIntroSequence());
    }

    IEnumerator PlayIntroSequence()
    {
        // 1. التقريب واللف على كل كلمة بالترتيب
        foreach (Transform target in wordTargets)
        {
            Vector3 targetPosition = new Vector3(target.position.x, target.position.y, transform.position.z);
            
            // تحريك الكاميرا للكلمة وتقريب الزوم ودورانها
            while (Vector3.Distance(transform.position, targetPosition) > 0.05f)
            {
                transform.position = Vector3.Lerp(transform.position, targetPosition, Time.deltaTime * moveSpeed);
                cam.orthographicSize = Mathf.Lerp(cam.orthographicSize, wordZoomSize, Time.deltaTime * moveSpeed);
                transform.Rotate(0, 0, rotateSpeed * Time.deltaTime); // تلف الكاميرا
                yield return null;
            }

            yield return new WaitForSeconds(waitAtWord);
        }

        // 2. الرجوع للوضع الطبيعي (Reset Camera)
        Quaternion targetRotation = Quaternion.identity; // إرجاع الدوران لـ 0
        Vector3 defaultPosition = new Vector3(0, 0, -10f); // نقطة الكاميرا العادية (أو مكان اللاعب)

        while (Quaternion.Angle(transform.rotation, targetRotation) > 0.1f || Mathf.Abs(cam.orthographicSize - defaultZoomSize) > 0.05f)
        {
            transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * moveSpeed);
            cam.orthographicSize = Mathf.Lerp(cam.orthographicSize, defaultZoomSize, Time.deltaTime * moveSpeed);
            yield return null;
        }

        transform.rotation = targetRotation;
        cam.orthographicSize = defaultZoomSize;

        // من هنا تقدر تفعل سكريبت حركة اللاعب أو الكاميرا العادية
    }
}