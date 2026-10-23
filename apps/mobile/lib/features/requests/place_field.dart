import 'package:flutter/material.dart';
import 'package:prismgo_api/prismgo_api.dart';

import '../../app/theme.dart';
import '../../shared/format.dart';

/// Address + coordinates, with recent places as one-tap chips. Until the Google
/// Maps key is configured, coordinates are pasted from Google Maps; Places
/// autocomplete replaces this once the key arrives.
class PlaceField extends StatefulWidget {
  const PlaceField({
    super.key,
    required this.label,
    required this.initial,
    required this.recent,
    required this.onChanged,
  });

  final String label;
  final LocationDto? initial;
  final List<LocationDto> recent;
  final ValueChanged<LocationDto?> onChanged;

  @override
  State<PlaceField> createState() => _PlaceFieldState();
}

class _PlaceFieldState extends State<PlaceField> {
  late final _address = TextEditingController(text: widget.initial?.address);
  late final _coords = TextEditingController(
    text: widget.initial == null
        ? ''
        : '${widget.initial!.lat}, ${widget.initial!.lng}',
  );

  @override
  void dispose() {
    _address.dispose();
    _coords.dispose();
    super.dispose();
  }

  void _emit() {
    final c = parseCoords(_coords.text);
    final address = _address.text.trim();
    widget.onChanged(
      address.length >= 3 && c != null
          ? LocationDto(address: address, lat: c.lat, lng: c.lng)
          : null,
    );
    setState(() {});
  }

  void _pick(LocationDto p) {
    _address.text = p.address;
    _coords.text = '${p.lat}, ${p.lng}';
    _emit();
  }

  @override
  Widget build(BuildContext context) {
    final coordsError =
        _coords.text.isNotEmpty && parseCoords(_coords.text) == null
        ? 'Enter as "26.7271, 88.3953"'
        : null;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.label, style: Theme.of(context).textTheme.titleSmall),
        const SizedBox(height: 8),
        TextField(
          controller: _address,
          decoration: InputDecoration(
            labelText: '${widget.label} address',
            hintText: 'Building, street, area',
          ),
          textInputAction: TextInputAction.next,
          onChanged: (_) => _emit(),
        ),
        const SizedBox(height: 10),
        TextField(
          controller: _coords,
          decoration: InputDecoration(
            labelText: '${widget.label} coordinates',
            hintText: '26.7271, 88.3953',
            helperText:
                'Long-press the spot in Google Maps and copy the numbers',
            errorText: coordsError,
          ),
          keyboardType: const TextInputType.numberWithOptions(
            decimal: true,
            signed: true,
          ),
          onChanged: (_) => _emit(),
        ),
        if (widget.recent.isNotEmpty) ...[
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: [
              for (final p in widget.recent)
                ActionChip(
                  label: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 220),
                    child: Text(p.address, overflow: TextOverflow.ellipsis),
                  ),
                  avatar: const Icon(
                    Icons.history,
                    size: 16,
                    color: Brand.sand600,
                  ),
                  onPressed: () => _pick(p),
                ),
            ],
          ),
        ],
      ],
    );
  }
}
